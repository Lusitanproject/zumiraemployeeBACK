"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFullStoryService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetFullStoryService {
    async execute(userId) {
        const chapters = await prisma_1.default.actChapter.findMany({
            where: {
                userId,
                type: "REGULAR",
                compilation: {
                    not: null,
                },
            },
            select: {
                id: true,
                title: true,
                compilation: true,
                createdAt: true,
                updatedAt: true,
                actChatbot: {
                    select: {
                        index: true,
                        name: true,
                    },
                },
            },
        });
        return { chapters };
    }
}
exports.GetFullStoryService = GetFullStoryService;
