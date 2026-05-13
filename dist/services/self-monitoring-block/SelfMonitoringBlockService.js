"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfMonitoringBlockService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class SelfMonitoringBlockService {
    async list() {
        const blocks = await prisma_1.default.selfMonitoringBlock.findMany({
            select: { id: true, title: true, summary: true, icon: true },
            where: { assessments: { some: {} } },
        });
        return { blocks };
    }
    async listResults({ userId, selfMonitoringBlockId }) {
        const results = await prisma_1.default.assessmentResult.findMany({
            where: { userId, assessment: { selfMonitoringBlockId } },
            include: {
                assessment: {
                    include: {
                        assessmentQuestions: { include: { psychologicalDimension: true } },
                    },
                },
                assessmentResultRating: { select: { risk: true } },
            },
        });
        const latestResults = {};
        results.forEach((r) => {
            if (!latestResults[r.assessment.id] || latestResults[r.assessment.id].createdAt < r.createdAt) {
                latestResults[r.assessment.id] = r;
            }
        });
        const formattedResults = Object.values(latestResults).map((r) => {
            const psychologicalDimensions = [
                ...new Set(r.assessment.assessmentQuestions.map((q) => q.psychologicalDimension.name)),
            ];
            return {
                id: r.id,
                feedback: r.feedback,
                assessmentResultRating: r.assessmentResultRating,
                assessment: {
                    id: r.assessment.id,
                    title: r.assessment.title,
                    summary: r.assessment.summary,
                    psychologicalDimensions,
                },
                answeredAt: r.createdAt,
            };
        });
        return { items: formattedResults };
    }
}
exports.SelfMonitoringBlockService = SelfMonitoringBlockService;
