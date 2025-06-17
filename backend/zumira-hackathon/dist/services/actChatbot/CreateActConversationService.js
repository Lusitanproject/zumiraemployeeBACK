"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActConversationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateActConversationService {
    async execute(data) {
        await prisma_1.default.actConversation.deleteMany({
            where: {
                userId: data.userId,
                messages: {
                    none: {},
                },
            },
        });
        const conversation = await prisma_1.default.actConversation.create({
            data,
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
exports.CreateActConversationService = CreateActConversationService;
