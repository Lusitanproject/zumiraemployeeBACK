"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActChapterService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetActChapterService {
    async execute({ userId, actChapterId }) {
        const [chapter, messages] = await Promise.all([
            prisma_1.default.actChapter.findFirst({
                where: { id: actChapterId },
                select: {
                    id: true,
                    title: true,
                    compilation: true,
                    actChatbot: {
                        select: {
                            id: true,
                            description: true,
                            icon: true,
                            name: true,
                            initialMessage: true,
                        },
                    },
                },
            }),
            prisma_1.default.actChapterMessage.findMany({
                where: {
                    actChapterId,
                    actChapter: {
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
        if (!chapter)
            throw new Error("Chapter not found");
        return { ...chapter, messages };
    }
}
exports.GetActChapterService = GetActChapterService;
