"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateFeedbackService = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../../prisma"));
async function messageAssistant(message, assistantId) {
    var _a, _b;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
        throw new Error("Invalid configuration: OPENAI_API_KEY was not defined.");
    }
    const headers = {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
    };
    try {
        // Criar um novo thread
        const threadResponse = await axios_1.default.post("https://api.openai.com/v1/threads", {}, { headers });
        const threadId = threadResponse.data.id;
        // Enviar mensagem ao thread
        await axios_1.default.post(`https://api.openai.com/v1/threads/${threadId}/messages`, { role: "user", content: `${message}` }, { headers });
        // Iniciar execução do assistente
        const runResponse = await axios_1.default.post(`https://api.openai.com/v1/threads/${threadId}/runs`, { assistant_id: assistantId, response_format: "auto" }, { headers });
        const runId = runResponse.data.id;
        // Aguardar finalização da execução
        let status = "in_progress";
        while (status === "in_progress" || status === "queued") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const runCheck = await axios_1.default.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                headers,
            });
            status = runCheck.data.status;
            if (status === "failed") {
                throw new Error();
            }
        }
        // Obter resposta do assistente
        const messagesResponse = await axios_1.default.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            headers,
        });
        const responseText = (_b = (_a = messagesResponse.data.data.find((msg) => msg.role === "assistant")) === null || _a === void 0 ? void 0 : _a.content[0]) === null || _b === void 0 ? void 0 : _b.text.value;
        if (!responseText) {
            throw new Error();
        }
        else {
            return { text: responseText };
        }
    }
    catch {
        throw new Error("Something went wrong");
    }
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
                openaiAssistantId: true,
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
        if (!(assessment === null || assessment === void 0 ? void 0 : assessment.openaiAssistantId))
            throw new Error("No assistant registered for this assessment");
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
        console.log(`Generating feedback for assessment ${assessmentId} with assistant ${assessment.openaiAssistantId}`);
        const response = await messageAssistant(message, assessment.openaiAssistantId);
        const assessmentFeeedback = await prisma_1.default.assessmentFeedback.create({
            data: {
                text: response.text,
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
exports.GenerateFeedbackService = GenerateFeedbackService;
