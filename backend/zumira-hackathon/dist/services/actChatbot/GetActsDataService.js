"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActsDataService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetActsDataService {
    async execute(userId) {
        const [chatbots, chapters] = await Promise.all([
            await prisma_1.default.actChatbot.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    icon: true,
                    nextActChatbotId: true,
                },
            }),
            prisma_1.default.actChapter.findMany({
                where: {
                    userId,
                    type: "REGULAR",
                },
                select: {
                    id: true,
                    title: true,
                    actChatbotId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
        ]);
        return { chatbots, chapters };
    }
}
exports.GetActsDataService = GetActsDataService;
