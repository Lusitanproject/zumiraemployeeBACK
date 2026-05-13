"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActChatbotAdminService = void 0;
const error_1 = require("../../error");
const chatbase_1 = require("../../external/chatbase");
const openai_1 = require("../../external/openai");
const prisma_1 = __importDefault(require("../../prisma"));
class ActAdminService {
    constructor() {
        this.actListSelect = {
            id: true,
            name: true,
            description: true,
            icon: true,
            index: true,
            trailId: true,
            createdAt: true,
        };
    }
    async findAll() {
        const bots = await prisma_1.default.actChatbot.findMany({
            select: this.actListSelect,
            orderBy: {
                index: "asc",
            },
        });
        return { items: bots };
    }
    async findByTrail(trailId) {
        const bots = await prisma_1.default.actChatbot.findMany({
            select: this.actListSelect,
            where: {
                trailId,
            },
            orderBy: {
                index: "asc",
            },
        });
        return { items: bots };
    }
    async create(data) {
        const existingBots = await prisma_1.default.actChatbot.findMany({ where: { trailId: data.trailId } });
        const bot = await prisma_1.default.actChatbot.create({
            data: {
                ...data,
                index: existingBots.length,
            },
        });
        // Garantir que todo usuário sem ato é atualizado quando o primeiro bot é criado
        const first = existingBots.find((b) => b.index === 0);
        if (first) {
            const noActUsers = await prisma_1.default.user.findMany({
                where: {
                    currentActChatbotId: null,
                },
            });
            await Promise.all([
                prisma_1.default.user.updateMany({
                    where: {
                        id: {
                            in: noActUsers.map((u) => u.id),
                        },
                    },
                    data: {
                        currentActChatbotId: first.id,
                    },
                }),
                ...noActUsers.map((user) => prisma_1.default.actChapter.create({
                    data: {
                        actChatbotId: first.id,
                        userId: user.id,
                        type: "REGULAR",
                    },
                })),
            ]);
        }
        return bot;
    }
    async update({ id, ...data }) {
        const bot = await prisma_1.default.actChatbot.update({
            where: { id },
            data,
        });
        return bot;
    }
    async updateMany({ chatbots }) {
        await Promise.all(chatbots.map((bot) => prisma_1.default.actChatbot.update({
            where: {
                id: bot.id,
            },
            data: { ...bot },
        })));
    }
    async importChatbaseChapters({ id, chatbaseChatbotId }) {
        const actChatbot = await prisma_1.default.actChatbot.findFirst({ where: { id } });
        if (!actChatbot) {
            throw new error_1.PublicError("Act chatbot does not exist");
        }
        const chatbase = new chatbase_1.ChatbaseApi();
        const conversations = await chatbase.getConversationsFromChatbot({
            chatbotId: chatbaseChatbotId,
            filteredSources: "WhatsApp",
        });
        // Remove previously imported chapters/messages for these conversations and import again.
        const existingChapters = await prisma_1.default.actChapter.findMany({
            where: {
                actChatbotId: id,
                externalId: {
                    in: conversations.map((c) => c.id),
                },
            },
            select: {
                id: true,
            },
        });
        const existingChapterIds = existingChapters.map((c) => c.id);
        if (existingChapterIds.length > 0) {
            await prisma_1.default.actChapterMessage.deleteMany({
                where: {
                    actChapterId: {
                        in: existingChapterIds,
                    },
                },
            });
            await prisma_1.default.actChapter.deleteMany({
                where: {
                    id: {
                        in: existingChapterIds,
                    },
                },
            });
        }
        // Normalize WhatsApp numbers so they match DB values.
        const normalizePhone = (p) => (p ? p.replace(/\D/g, "").replace(/^55/, "") : "");
        const conversationUsersPhoneNumbers = conversations
            .map((c) => { var _a; return normalizePhone((_a = c.form_submission) === null || _a === void 0 ? void 0 : _a.phone); })
            .filter(Boolean);
        const storedUsers = await prisma_1.default.user.findMany({
            where: {
                phoneNumber: {
                    in: conversationUsersPhoneNumbers,
                },
            },
        });
        // Map normalized phone number -> user id for quick lookup.
        const phoneToUserId = new Map(storedUsers.map((u) => [normalizePhone(u.phoneNumber), u.id]));
        const chaptersFromConversations = await prisma_1.default.actChapter.createManyAndReturn({
            data: conversations
                .map((conv) => {
                var _a;
                const phone = normalizePhone((_a = conv.form_submission) === null || _a === void 0 ? void 0 : _a.phone);
                const userId = phoneToUserId.get(phone);
                if (!userId) {
                    return null;
                }
                return {
                    actChatbotId: id,
                    userId,
                    type: "REGULAR",
                    externalId: conv.id,
                    createdAt: conv.created_at,
                };
            })
                .filter((v) => v !== null),
        });
        const createdMessages = await prisma_1.default.actChapterMessage.createMany({
            // Attach imported messages to their created chapter by external conversation id.
            data: chaptersFromConversations.flatMap((chapter) => {
                const conv = conversations.find((conv) => conv.id === chapter.externalId);
                if (!conv) {
                    return [];
                }
                const messages = conv.messages.map((m) => ({
                    actChapterId: chapter.id,
                    content: m.content,
                    role: m.role,
                    createdAt: m.created_at,
                }));
                return messages;
            }),
        });
        const importedUserIds = new Set(chaptersFromConversations.map((chapter) => chapter.userId));
        const usersFound = storedUsers.filter((u) => importedUserIds.has(u.id));
        const conversationsWithoutUser = conversations
            .filter((conv) => {
            var _a;
            const phone = normalizePhone((_a = conv.form_submission) === null || _a === void 0 ? void 0 : _a.phone);
            return !phoneToUserId.has(phone);
        })
            .map((conv) => {
            var _a, _b;
            return ({
                conversationId: conv.id,
                phone: normalizePhone((_a = conv.form_submission) === null || _a === void 0 ? void 0 : _a.phone) || null,
                name: ((_b = conv.form_submission) === null || _b === void 0 ? void 0 : _b.name) || null,
            });
        });
        const usersFoundStructured = usersFound.map((u) => ({
            userId: u.id,
            name: u.name,
            phone: u.phoneNumber,
        }));
        return {
            chaptersCreated: chaptersFromConversations.length,
            messagesCreated: createdMessages.count,
            usersFound: usersFoundStructured,
            conversationsWithoutUser,
        };
    }
    async generateAnalysis(companyId, actChatbotId) {
        console.log(`Gerando análise para a empresa ${companyId} e o chatbot ${actChatbotId}`);
        const factors = await prisma_1.default.psychosocialFactor.findMany({
            select: { id: true, name: true, description: true },
        });
        const chapters = await prisma_1.default.actChapter.findMany({
            where: {
                type: "REGULAR",
                actChatbot: { id: actChatbotId },
                user: { companyId },
            },
            include: {
                messages: { select: { id: true, role: true, content: true } },
            },
        });
        const newAnalysis = await prisma_1.default.companyActAnalysis.create({
            data: { actChatbotId, companyId },
        });
        const instructions = await this.buildPsychosocialPrompt(factors);
        const batchItems = chapters.map((chapter) => ({
            customId: chapter.id,
            messages: [{ content: JSON.stringify(chapter.messages), role: "user" }],
        }));
        const openai = new openai_1.OpenAiApi();
        const batchResult = await openai.createBatch({ instructions, batchItems });
        console.log(`Lote OpenAI criado com ${batchItems.length} itens`);
        await prisma_1.default.companyActAnalysisBatch.create({
            data: { batchId: batchResult.batchId, companyActAnalysisId: newAnalysis.id },
        });
    }
    async buildPsychosocialPrompt(factors) {
        const factorsJson = JSON.stringify(factors);
        return `
Você é um classificador técnico especializado em fatores psicossociais em comunicações corporativas.

Sua tarefa é analisar mensagens de uma conversa e identificar somente os fatores psicossociais que realmente se aplicam às mensagens enviadas por usuários.

Os fatores disponíveis são:

${factorsJson}

Você receberá um JSON contendo:

- messages: lista de mensagens da conversa, onde cada item possui:
  - id
  - role
  - content

Objetivo:

Avaliar somente mensagens cujo role seja "user" e retornar apenas as combinações positivas (mensagem x fator) em que exista aderência real.

Regras obrigatórias:

1. Analise apenas mensagens com role igual a "user".
2. Ignore mensagens com qualquer outro role no resultado final.
3. Considere todas as mensagens da conversa como contexto para interpretação.
4. Avalie todos os fatores listados acima para cada mensagem elegível.
5. O campo factor_id é string.
6. Retorne somente fatores com aderência positiva.
7. Não retorne fatores negativos, inconclusivos ou nulos.
8. Se o factor_id for nulo, indefinido ou não aplicável, não inclua item em results.
9. Utilize somente os fatores fornecidos.
10. Nunca invente fatores.
11. Considere significado semântico, tom, intenção e sinais indiretos.
12. Seja criterioso e conservador. Só classifique quando houver evidência razoável.
13. Se nenhuma mensagem de role "user" possuir aderência a qualquer fator, retorne results vazio.
14. Retorne apenas JSON válido.
15. Não inclua explicações, comentários ou texto adicional.

Formato obrigatório de resposta:

{
  "associations": [
    {
      "message_id": "string",
      "factor_id": "string"
    }
  ]
}
`.trim();
    }
}
exports.ActChatbotAdminService = ActAdminService;
