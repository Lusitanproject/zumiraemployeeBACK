"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFullStoryService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class GetFullStoryService {
    async execute(userId) {
        var _a;
        const user = await prisma_1.default.user.findFirst({ where: { id: userId }, select: { company: true } });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const chapters = await prisma_1.default.actChapter.findMany({
            where: {
                userId,
                type: "REGULAR",
                compilation: {
                    not: null,
                },
                actChatbot: {
                    trailId: (_a = user.company) === null || _a === void 0 ? void 0 : _a.trailId,
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
