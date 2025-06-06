"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToNextActService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class MoveToNextActService {
    async execute(userId) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
            include: {
                currentActChatbot: true,
            },
        });
        if (!user)
            throw new Error("User not found");
        if (!user.currentActChatbot)
            throw new Error("User is not assigned to any acts");
        if (!user.currentActChatbot.nextActChatbotId)
            throw new Error("No more acts remaining");
        const currentActMessages = await prisma_1.default.actConversationMessage.findMany({
            where: {
                actConversation: {
                    userId,
                    actChatbotId: user.currentActChatbot.id,
                },
            },
        });
        if (!currentActMessages.length)
            throw new Error("User has not started the current act");
        await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                currentActChatbotId: user.currentActChatbot.nextActChatbotId,
            },
        });
        const conversation = await prisma_1.default.actConversation.create({
            data: {
                userId,
                actChatbotId: user.currentActChatbot.nextActChatbotId,
            },
            select: {
                id: true,
                actChatbot: {
                    select: {
                        name: true,
                        icon: true,
                        description: true,
                    },
                },
            },
        });
        return conversation;
    }
}
exports.MoveToNextActService = MoveToNextActService;
