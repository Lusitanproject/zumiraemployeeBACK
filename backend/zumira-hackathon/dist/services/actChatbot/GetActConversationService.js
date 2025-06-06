"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActConversationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetActConversationService {
    async execute({ userId, actConversationId }) {
        const [conversation, messages] = await Promise.all([
            prisma_1.default.actConversation.findFirst({
                where: { id: actConversationId },
                select: {
                    id: true,
                    title: true,
                    actChatbotId: true,
                },
            }),
            prisma_1.default.actConversationMessage.findMany({
                where: {
                    actConversationId,
                    actConversation: {
                        userId,
                    },
                },
                select: {
                    content: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            }),
        ]);
        return { conversation, messages };
    }
}
exports.GetActConversationService = GetActConversationService;
