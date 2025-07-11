"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActsDataService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetActsDataService {
    async execute(userId) {
        const [user, chatbots, chapters] = await Promise.all([
            await prisma_1.default.user.findFirst({
                where: {
                    id: userId,
                },
            }),
            await prisma_1.default.actChatbot.findMany({
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
                orderBy: {
                    updatedAt: "desc",
                },
            }),
        ]);
        if (!user)
            throw new Error("Usuário não encontrado");
        let currAct = chatbots.find((bot) => bot.id === user.currentActChatbotId);
        if (!currAct) {
            if (!chatbots.length)
                return { chatbots: [], chapters: [] };
            currAct = chatbots[0];
            await prisma_1.default.user.update({ where: { id: userId }, data: { currentActChatbotId: currAct === null || currAct === void 0 ? void 0 : currAct.id } });
        }
        const processedChatbots = chatbots.map((bot) => ({
            ...bot,
            locked: bot.index > currAct.index,
            current: bot.id === currAct.id,
        }));
        return { chatbots: processedChatbots, chapters };
    }
}
exports.GetActsDataService = GetActsDataService;
