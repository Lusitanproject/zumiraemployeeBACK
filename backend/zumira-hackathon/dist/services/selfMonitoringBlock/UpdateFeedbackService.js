"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeedbackService = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../../prisma"));
async function messageAssistant(message, assistantId) {
    var _a, _b, _c;
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
        const responseText = (_c = (_b = (_a = messagesResponse.data.data.find((msg) => msg.role === "assistant")) === null || _a === void 0 ? void 0 : _a.content[0]) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.value;
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
class UpdateFeedbackService {
    async execute({ userId, selfMonitoringBlockId }) {
        const dimensions = await prisma_1.default.psychologicalDimension.findMany({
            where: {
                selfMonitoringBlockId: selfMonitoringBlockId,
            },
            select: {
                id: true,
                name: true,
                acronym: true,
            },
        });
        if (!dimensions.length)
            throw new Error("No dimensions registered in this block");
        const block = await prisma_1.default.selfMonitoringBlock.findFirst({
            where: {
                id: selfMonitoringBlockId,
            },
            select: {
                openaiAssistantId: true,
                assessments: {
                    select: {
                        assessmentResults: {
                            select: {
                                createdAt: true,
                                assessmentQuestionAnswers: {
                                    include: {
                                        assessmentQuestionChoice: {
                                            select: {
                                                value: true,
                                                assessmentQuestion: {
                                                    select: {
                                                        psychologicalDimension: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!block)
            throw new Error("Block does not exist");
        if (!block.openaiAssistantId)
            throw new Error("No assistant registered for this block");
        const dimensionValues = dimensions.map((d) => ({ dimension: d, values: [] }));
        for (const assessment of block.assessments) {
            if (assessment.assessmentResults.length === 0)
                continue;
            const result = assessment.assessmentResults.reduce((max, r) => new Date(r.createdAt) > new Date(max.createdAt) ? r : max);
            for (const answer of result.assessmentQuestionAnswers) {
                const dimension = dimensionValues.find((d) => d.dimension.id === answer.assessmentQuestionChoice.assessmentQuestion.psychologicalDimension.id);
                dimension === null || dimension === void 0 ? void 0 : dimension.values.push(answer.assessmentQuestionChoice.value);
            }
        }
        const message = dimensionValues
            .filter((d) => d.values.length)
            .map((d) => {
            const sum = d.values.reduce((sum, v) => sum + v, 0);
            const average = sum / d.values.length;
            return `${d.dimension.name}: ${average.toFixed(2)}`;
        })
            .join(", ");
        if (!message)
            throw new Error("No values to send");
        const response = await messageAssistant(message, block.openaiAssistantId);
        const selfMonitorigFeedback = await prisma_1.default.selfMonitoringFeedback.create({
            data: {
                text: response.text,
                userId,
                selfMonitoringBlockId,
            },
            select: {
                id: true,
                text: true,
                userId: true,
                selfMonitoringBlockId: true,
            },
        });
        return selfMonitorigFeedback;
    }
}
exports.UpdateFeedbackService = UpdateFeedbackService;
