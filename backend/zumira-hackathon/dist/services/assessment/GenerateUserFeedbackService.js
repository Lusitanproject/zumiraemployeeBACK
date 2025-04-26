"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUserFeedbackService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const openai_1 = __importDefault(require("openai"));
async function sendMessage(instructions, message) {
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
        text: {
            format: {
                type: "text",
            },
        },
        reasoning: {},
        tools: [],
        temperature: 1,
        max_output_tokens: 2048,
        top_p: 1,
        store: true,
    });
    return response;
}
class GenerateUserFeedbackService {
    async execute({ userId, assessmentId }) {
        const result = await prisma_1.default.assessmentResult.findFirst({
            where: {
                assessmentId,
                userId,
            },
            include: {
                assessment: true,
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
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!result)
            throw new Error("No results for this assessment");
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
        if (!message)
            throw new Error("No values to send");
        console.log(`Generating user feedback for assessment ${assessmentId}`);
        const response = await sendMessage(result.assessment.userFeedbackInstructions, message);
        const assessmentFeeedback = await prisma_1.default.userAssessmentFeedback.create({
            data: {
                text: response.output_text,
                userId,
                assessmentId,
            },
            select: {
                id: true,
                text: true,
                userId: true,
                assessmentId: true,
            },
        });
        return assessmentFeeedback;
    }
}
exports.GenerateUserFeedbackService = GenerateUserFeedbackService;
