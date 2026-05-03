"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileActChapterService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const openai_1 = require("../../external/openai");
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
        const openai = new openai_1.OpenAiApi();
        const response = await openai.generateResponse({
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
