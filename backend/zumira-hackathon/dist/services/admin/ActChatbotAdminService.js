"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActChatbotAdminService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma"));
const getFirstActChatbot_1 = require("../../utils/getFirstActChatbot");
const error_1 = require("../../error");
class ActChatbotAdminService {
    async find(id) {
        const bot = await prisma_1.default.actChatbot.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                instructions: true,
                nextActChatbotId: true,
            },
        });
        return bot;
    }
    async findAll() {
        const bots = await prisma_1.default.actChatbot.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                nextActChatbotId: true,
            },
        });
        const items = [];
        let aux = bots.find((b) => !b.nextActChatbotId);
        while (aux) {
            items.unshift(aux);
            aux = bots.find((b) => b.nextActChatbotId === (aux === null || aux === void 0 ? void 0 : aux.id));
        }
        return { items };
    }
    async create(data) {
        const bot = await prisma_1.default.actChatbot.create({
            data: {
                ...data,
            },
        });
        await prisma_1.default.actChatbot.updateMany({
            where: {
                nextActChatbot: null,
                id: {
                    not: bot.id,
                },
            },
            data: {
                nextActChatbotId: bot.id,
            },
        });
        // Garantir que todo usuário sem ato é atualizado quando o primeiro bot é criado
        const first = await (0, getFirstActChatbot_1.getFirstActChatbot)();
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
                ...noActUsers.map((user) => prisma_1.default.actConversation.create({
                    data: {
                        actChatbotId: first.id,
                        userId: user.id,
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
    async reorder({ chatbots }) {
        const bots = await prisma_1.default.actChatbot.findMany();
        if (chatbots.length !== bots.length)
            throw new error_1.PublicError("Todos os chatbots devem ser enviados");
        const botsMap = new Map();
        chatbots.forEach((cb) => botsMap.set(cb.nextActChatbotId, cb.id));
        // O loop tenta caminhar por todos os ids seguindo a estrutura passada na requisição para verificar se todos estão contectados linearmente
        let count = -1;
        let aux = null;
        do {
            count += 1;
            aux = botsMap.get(aux);
        } while (aux !== undefined);
        if (count < chatbots.length)
            throw new error_1.PublicError("Os chatbots devem estar todos conectados continuamente");
        const queryString = client_1.Prisma.sql `
      UPDATE act_chatbots
      SET next_act_chatbot_id = CASE id
        ${client_1.Prisma.join(chatbots.map((cb) => client_1.Prisma.sql `
              WHEN ${cb.id} THEN ${cb.nextActChatbotId}
            `), "\n")}
      END
      WHERE id IN (${client_1.Prisma.join(chatbots.map((cb) => client_1.Prisma.sql `${cb.id}`), ", ")})
    `;
        await prisma_1.default.$executeRaw(queryString);
    }
}
exports.ActChatbotAdminService = ActChatbotAdminService;
