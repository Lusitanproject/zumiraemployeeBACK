"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActChatbotAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
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
                messageInstructions: true,
                compilationInstructions: true,
                index: true,
                actChapters: {
                    where: {
                        type: "ADMIN_TEST",
                    },
                    select: {
                        id: true,
                        title: true,
                    },
                },
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
                index: true,
            },
            orderBy: {
                index: "asc",
            },
        });
        return { items: bots };
    }
    async create(data) {
        const existingBots = await prisma_1.default.actChatbot.findMany();
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
}
exports.ActChatbotAdminService = ActChatbotAdminService;
