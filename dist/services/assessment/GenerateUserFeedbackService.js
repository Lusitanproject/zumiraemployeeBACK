"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUserFeedbackService = void 0;
const client_1 = require("@prisma/client");
const openai_1 = __importDefault(require("openai"));
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const devLog_1 = require("../../utils/devLog");
const assessmentResultInclude = client_1.Prisma.validator()({
    include: {
        assessment: {
            include: {
                assessmentResultRatings: true,
                selfMonitoringBlock: true,
            },
        },
        assessmentQuestionAnswers: {
            include: {
                assessmentQuestionChoice: true,
                assessmentQuestion: {
                    include: {
                        psychologicalDimension: true,
                    },
                },
            },
        },
    },
});
function createMessage(result) {
    const dimensionAnswersValues = {};
    result.assessmentQuestionAnswers.map((answer) => {
        const dimension = answer.assessmentQuestion.psychologicalDimension.name;
        if (!dimensionAnswersValues[dimension])
            dimensionAnswersValues[dimension] = [];
        dimensionAnswersValues[dimension].push(answer.assessmentQuestionChoice.value);
    });
    const message = Object.entries(dimensionAnswersValues)
        .map(([dimension, values]) => {
        const sum = values.reduce((sum, v) => sum + v, 0);
        const average = sum / values.length;
        switch (result.assessment.operationType) {
            case "SUM":
                return `${dimension}: ${sum.toFixed(2)}`;
            case "AVERAGE":
                return `${dimension}: ${average.toFixed(2)}`;
        }
    })
        .join(", ");
    return message;
}
async function generateResponse(instructions, message, ratings) {
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const instructionsObj = {
        role: "system",
        content: [
            {
                type: "input_text",
                text: instructions,
            },
        ],
    };
    const response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
            ...(instructions ? [instructionsObj] : []),
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: message,
                    },
                ],
            },
        ],
        tools: [
            {
                type: "function",
                name: "generate_feedback",
                description: "Devolutiva do teste psicológico, interpretando os resultados de seus domínios avaliados e identificando perfis associados.",
                parameters: {
                    type: "object",
                    required: ["feedback", "identifiedProfile", "generateAlert"],
                    properties: {
                        feedback: {
                            type: "string",
                            description: "Texto longo, completo e detalhado da devolutiva de acordo com a interpretação dos resultados. Utilize markdown.",
                        },
                        identifiedProfile: {
                            type: "string",
                            description: "Perfil identificado baseado nos escores obtidos.",
                            enum: ratings.map((r) => r.profile),
                        },
                        generateAlert: {
                            type: "boolean",
                            description: "Indica se é necessário gerar um alerta com base no perfil identificado.",
                        },
                    },
                    additionalProperties: false,
                },
                strict: true,
            },
        ],
        tool_choice: {
            type: "function",
            name: "generate_feedback",
        },
        max_output_tokens: 4096,
    });
    return response;
}
async function storeFeedback(result, feedback, rating) {
    await prisma_1.default.assessmentResult.update({
        where: {
            id: result.id,
        },
        data: {
            feedback,
            assessmentResultRatingId: rating === null || rating === void 0 ? void 0 : rating.id,
        },
    });
}
async function createAlert(result, rating) {
    await prisma_1.default.alert.create({
        data: {
            assessmentResultId: result.id,
            assessmentResultRatingId: rating.id,
        },
    });
}
class GenerateUserFeedbackService {
    async execute({ userId, assessmentId }) {
        const result = await prisma_1.default.assessmentResult.findFirst({
            where: {
                assessmentId,
                userId,
            },
            include: assessmentResultInclude.include,
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!result)
            throw new error_1.PublicError("Nenhum resultado para esta avaliação");
        const message = createMessage(result);
        if (!message)
            throw new error_1.PublicError("Nenhum valor para enviar");
        (0, devLog_1.devLog)("Message: ", message);
        const response = await generateResponse(result.assessment.userFeedbackInstructions, message, result.assessment.assessmentResultRatings);
        // Workaround para a tipagem desatualizada da resposta da openai (nao tem .arguments)
        const toolCall = response.output[0];
        const args = JSON.parse(toolCall.arguments);
        (0, devLog_1.devLog)("AI response: ", args);
        const ratings = result.assessment.assessmentResultRatings;
        const rating = ratings.find((r) => r.profile === args.identifiedProfile);
        if (!rating && ratings.length !== 0) {
            throw new error_1.PublicError(`Perfil "${args.identifiedProfile}" não existe`);
        }
        await storeFeedback(result, args.feedback, rating);
        if (args.generateAlert && rating)
            await createAlert(result, rating);
        return args;
    }
}
exports.GenerateUserFeedbackService = GenerateUserFeedbackService;
