"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToNextActService = void 0;
const error_1 = require("../../error");
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
            throw new error_1.PublicError("Usuário não encontrado");
        if (!user.currentActChatbot)
            throw new error_1.PublicError("Usuário não está atribuído a nenhum ato");
        if (!user.currentActChatbot.nextActChatbotId)
            throw new error_1.PublicError("Não há mais atos restantes");
        const currentActMessages = await prisma_1.default.actChapterMessage.findMany({
            where: {
                actChapter: {
                    userId,
                    actChatbotId: user.currentActChatbot.id,
                },
            },
        });
        if (!currentActMessages.length)
            throw new error_1.PublicError("Usuário não iniciou o ato atual");
        await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                currentActChatbotId: user.currentActChatbot.nextActChatbotId,
            },
        });
        const chapter = await prisma_1.default.actChapter.create({
            data: {
                userId,
                actChatbotId: user.currentActChatbot.nextActChatbotId,
                type: "REGULAR",
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
        return chapter;
    }
}
exports.MoveToNextActService = MoveToNextActService;
