"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageActChatbotService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const generateOpenAiResponse_1 = require("../../utils/generateOpenAiResponse");
class MessageActChatbotService {
    async execute({ content, actChapterId, userId }) {
        const conv = await prisma_1.default.actChapter.findFirst({
            where: {
                id: actChapterId,
                userId,
            },
            include: {
                actChatbot: true,
                user: true,
            },
        });
        if (!conv)
            throw new error_1.PublicError("Conversa não existe");
        await prisma_1.default.actChapterMessage.create({
            data: {
                actChapterId,
                role: "user",
                content,
            },
        });
        const { actChatbot: bot } = conv;
        const messages = await prisma_1.default.actChapterMessage.findMany({
            where: {
                actChapterId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const historyAndInput = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        const response = await (0, generateOpenAiResponse_1.generateOpenAiResponse)({
            instructions: bot.messageInstructions + `\nO nome do usuário é: ${conv.user.name.split(" ")[0]}`,
            messages: historyAndInput,
        });
        await Promise.all([
            prisma_1.default.actChapterMessage.create({
                data: {
                    actChapterId,
                    role: "assistant",
                    content: response.output_text,
                },
            }),
            prisma_1.default.actChapter.update({
                where: {
                    id: actChapterId,
                },
                data: {
                    updatedAt: new Date(),
                },
            }),
        ]);
        return response.output_text;
    }
}
exports.MessageActChatbotService = MessageActChatbotService;
