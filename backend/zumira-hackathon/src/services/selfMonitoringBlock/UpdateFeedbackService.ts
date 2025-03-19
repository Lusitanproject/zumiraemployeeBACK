import axios from "axios";
import prismaClient from "../../prisma";

interface UpdateFeedbackRequest {
    userId: string;
    selfMonitoringBlockId: string;
}

async function messageAssistant(message: string, assistantId: string) {
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
        const threadResponse = await axios.post("https://api.openai.com/v1/threads", {}, { headers });
        const threadId = threadResponse.data.id;

        // Enviar mensagem ao thread
        await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/messages`,
            { role: "user", content: `${message}` },
            { headers }
        );

        // Iniciar execução do assistente
        const runResponse = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
            { assistant_id: assistantId, response_format: "auto" },
            { headers }
        );
        const runId = runResponse.data.id;

        // Aguardar finalização da execução
        let status = "in_progress";
        while (status === "in_progress" || status === "queued") {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const runCheck = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                headers,
            });

            status = runCheck.data.status;
            if (status === "failed") {
                throw new Error();
            }
        }

        // Obter resposta do assistente
        const messagesResponse = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            headers,
        });

        const responseText = messagesResponse.data.data.find((msg: any) => msg.role === "assistant")?.content[0]?.text
            ?.value;
        if (!responseText) {
            throw new Error();
        } else {
            return { text: responseText };
        }
    } catch {
        throw new Error("Something went wrong");
    }
}

class UpdateFeedbackService {
    async execute({ userId, selfMonitoringBlockId }: UpdateFeedbackRequest) {
        const dimensions = await prismaClient.psychologicalDimension.findMany({
            where: {
                selfMonitoringBlockId: selfMonitoringBlockId,
            },
            select: {
                id: true,
                name: true,
                acronym: true,
            },
        });
        if (!dimensions.length) throw new Error("No dimensions registered in this block");

        const block = await prismaClient.selfMonitoringBlock.findFirst({
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
        if (!block) throw new Error("Block does not exist");
        if (!block.openaiAssistantId) throw new Error("No assistant registered for this block");

        const dimensionValues = dimensions.map((d) => ({ dimension: d, values: [] as number[] }));

        for (const assessment of block.assessments) {
            if (assessment.assessmentResults.length === 0) continue;

            const result = assessment.assessmentResults.reduce((max, r) =>
                new Date(r.createdAt) > new Date(max.createdAt) ? r : max
            );

            for (const answer of result.assessmentQuestionAnswers) {
                const dimension = dimensionValues.find(
                    (d) =>
                        d.dimension.id === answer.assessmentQuestionChoice.assessmentQuestion.psychologicalDimension.id
                );
                dimension?.values.push(answer.assessmentQuestionChoice.value);
            }
        }

        const message = dimensionValues
            .map((d) => {
                const sum = d.values.reduce((sum, v) => sum + v, 0);
                const average = sum / d.values.length;
                return `${d.dimension.name}: ${average.toFixed(2)}`;
            })
            .join(", ");

        const response = await messageAssistant(message, block.openaiAssistantId);

        const selfMonitorigFeedback = await prismaClient.selfMonitoringFeedback.create({
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

export { UpdateFeedbackService };
