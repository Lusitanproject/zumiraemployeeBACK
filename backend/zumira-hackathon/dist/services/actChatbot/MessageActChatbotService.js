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
    async execute({ content, actConversationId, userId }) {
        const conv = await prisma_1.default.actConversation.findFirst({
            where: {
                id: actConversationId,
                userId,
            },
            include: {
                actChatbot: true,
            },
        });
        if (!conv)
            throw new error_1.PublicError("Conversa não existe");
        await prisma_1.default.actConversationMessage.create({
            data: {
                actConversationId,
                role: "user",
                content,
            },
        });
        const { actChatbot: bot } = conv;
        const messages = await prisma_1.default.actConversationMessage.findMany({
            where: {
                actConversationId,
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
            instructions: bot.instructions,
            messages: historyAndInput,
        });
        await Promise.all([
            prisma_1.default.actConversationMessage.create({
                data: {
                    actConversationId,
                    role: "assistant",
                    content: response.output_text,
                },
            }),
            prisma_1.default.actConversation.update({
                where: {
                    id: actConversationId,
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
