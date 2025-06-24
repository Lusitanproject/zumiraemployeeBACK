"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActChapterService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateActChapterService {
    async execute({ userId, actChapterId, compilation, title }) {
        const chapter = await prisma_1.default.actChapter.findFirst({
            where: {
                id: actChapterId,
                userId,
            },
        });
        if (!chapter)
            throw new Error("Chapter not found");
        const result = await prisma_1.default.actChapter.update({
            where: {
                id: actChapterId,
                userId,
            },
            data: {
                compilation,
                title,
            },
        });
        return result;
    }
}
exports.UpdateActChapterService = UpdateActChapterService;
