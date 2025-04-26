"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFeedbackService = void 0;
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
class GenerateFeedbackService {
    async execute({ userId, assessmentId }) {
        const latestResult = await prisma_1.default.assessmentResult.findFirst({
            where: {
                assessmentId,
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!latestResult)
            throw new Error("No results for this assessment");
        const assessment = await prisma_1.default.assessment.findFirst({
            where: {
                id: assessmentId,
            },
            select: {
                feedbackInstructions: true,
                operationType: true,
                assessmentQuestions: {
                    select: {
                        psychologicalDimension: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        assessmentQuestionAnswers: {
                            where: {
                                userId: userId,
                                assessmentResultId: latestResult.id,
                            },
                            include: {
                                assessmentQuestionChoice: true,
                            },
                        },
                    },
                },
            },
        });
        if (!assessment)
            throw new Error("Assessment does not exist");
        const dimensions = [];
        assessment.assessmentQuestions.map((q) => {
            if (!dimensions.find((d) => d.data.id === q.psychologicalDimension.id)) {
                dimensions.push({ data: q.psychologicalDimension, values: [] });
            }
        });
        for (const question of assessment.assessmentQuestions) {
            const answer = question.assessmentQuestionAnswers[0];
            if (!answer)
                continue;
            const dimension = dimensions.find((d) => d.data.id === question.psychologicalDimension.id);
            dimension === null || dimension === void 0 ? void 0 : dimension.values.push(answer.assessmentQuestionChoice.value);
        }
        const message = dimensions
            .filter((d) => d.values.length)
            .map((d) => {
            const sum = d.values.reduce((sum, v) => sum + v, 0);
            const average = sum / d.values.length;
            switch (assessment.operationType) {
                case "SUM":
                    return `${d.data.name}: ${sum.toFixed(2)}`;
                case "AVERAGE":
                    return `${d.data.name}: ${average.toFixed(2)}`;
            }
        })
            .join(", ");
        if (!message)
            throw new Error("No values to send");
        console.log(`Generating feedback for assessment ${assessmentId}`);
        const response = await sendMessage(assessment.feedbackInstructions, message);
        const assessmentFeeedback = await prisma_1.default.assessmentFeedback.create({
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
        console.log(`Done generating feedback for assessment ${assessmentId}`);
        return assessmentFeeedback;
    }
}
exports.GenerateFeedbackService = GenerateFeedbackService;
