"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileActChapterService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const generateOpenAiResponse_1 = require("../../utils/generateOpenAiResponse");
class CompileActChapterService {
    async execute({ actChapterId, userId }) {
        const chapter = await prisma_1.default.actChapter.findFirst({
            where: {
                userId,
                id: actChapterId,
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
                actChatbot: true,
            },
        });
        if (!chapter)
            throw new Error("Chapter not found");
        const messages = chapter.messages.map((m) => ({
            content: m.content,
            role: "user",
        }));
        const response = await (0, generateOpenAiResponse_1.generateOpenAiResponse)({
            messages,
            instructions: chapter.actChatbot.compilationInstructions,
        });
        const data = await prisma_1.default.actChapter.update({
            where: {
                id: actChapterId,
            },
            data: {
                compilation: response.output_text,
            },
        });
        return data;
    }
}
exports.CompileActChapterService = CompileActChapterService;
