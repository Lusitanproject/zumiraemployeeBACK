"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActsDataService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
function getProgress(bots, chapters) {
    const _bots = [...bots].sort((a, b) => a.index - b.index);
    let completedActs = 0;
    for (const bot of _bots) {
        if (chapters.find((chapter) => chapter.actChatbotId === bot.id && !!chapter.compilation)) {
            completedActs += 1;
        }
        else {
            break;
        }
    }
    return completedActs / _bots.length;
}
class GetActsDataService {
    async execute(userId) {
        var _a, _b;
        const user = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
            include: {
                company: true,
            },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const [chatbots, chapters] = await Promise.all([
            await prisma_1.default.actChatbot.findMany({
                where: {
                    trailId: (_a = user.company) === null || _a === void 0 ? void 0 : _a.trailId,
                },
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
                    actChatbot: {
                        trailId: (_b = user.company) === null || _b === void 0 ? void 0 : _b.trailId,
                    },
                },
                select: {
                    id: true,
                    title: true,
                    actChatbotId: true,
                    compilation: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            }),
        ]);
        const progress = getProgress(chatbots, chapters);
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
        const processedChapters = chapters.map((chapter) => {
            const { compilation: _, ...formatted } = chapter;
            return formatted;
        });
        return { chatbots: processedChatbots, chapters: processedChapters, progress };
    }
}
exports.GetActsDataService = GetActsDataService;
