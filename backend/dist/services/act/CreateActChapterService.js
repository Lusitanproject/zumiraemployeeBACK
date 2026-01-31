"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActChapterService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateActChapterService {
    async execute(data) {
        await prisma_1.default.actChapter.deleteMany({
            where: {
                userId: data.userId,
                messages: {
                    none: {},
                },
            },
        });
        const chapter = await prisma_1.default.actChapter.create({
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
        return chapter;
    }
}
exports.CreateActChapterService = CreateActChapterService;
