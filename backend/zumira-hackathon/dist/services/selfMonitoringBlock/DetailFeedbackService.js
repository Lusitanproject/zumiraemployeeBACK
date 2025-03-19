"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailFeedbackService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DetailFeedbackService {
    async execute({ userId, selfMonitoringBlockId }) {
        const feedback = await prisma_1.default.selfMonitoringFeedback.findFirst({
            where: {
                selfMonitoringBlockId,
                userId,
            },
            select: {
                text: true,
                userId: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        icon: true,
                        pyschologicalDimensions: {
                            select: {
                                name: true,
                                acronym: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return feedback;
    }
}
exports.DetailFeedbackService = DetailFeedbackService;
