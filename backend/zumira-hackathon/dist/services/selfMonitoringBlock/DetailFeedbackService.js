"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailFeedbackService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DetailFeedbackService {
    async execute({ userId, selfMonitoringBlockId }) {
        const feedbacks = await prisma_1.default.assessmentFeedback.findMany({
            where: {
                userId,
                assessment: {
                    selfMonitoringBlockId,
                },
            },
            select: {
                id: true,
                text: true,
                createdAt: true,
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        selfMonitoringBlock: {
                            select: {
                                id: true,
                                title: true,
                                psychologicalDimensions: {
                                    select: {
                                        id: true,
                                        name: true,
                                        acronym: true,
                                    },
                                },
                            },
                        },
                        assessmentResults: true,
                        assessmentQuestions: {
                            select: {
                                psychologicalDimension: {
                                    select: {
                                        id: true,
                                        name: true,
                                        acronym: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            distinct: ["assessmentId"],
        });
        const assessments = await prisma_1.default.assessment.findMany({
            where: {
                selfMonitoringBlockId,
            },
            include: {
                assessmentResults: {
                    select: {
                        id: true,
                    },
                    where: {
                        userId,
                    },
                },
                assessmentFeedbacks: {
                    select: {
                        id: true,
                    },
                    where: {
                        userId,
                    },
                },
            },
        });
        const formattedFeedbacks = feedbacks.map((f) => ({
            id: f.id,
            text: f.text,
            assessment: {
                id: f.assessment.id,
                title: f.assessment.title,
                psychologicalDimensions: [
                    // Cria uma lista com dimensões únicas
                    ...new Map(f.assessment.assessmentQuestions.map((q) => [
                        q.psychologicalDimension.id,
                        {
                            id: q.psychologicalDimension.id,
                            name: q.psychologicalDimension.name,
                            acronym: q.psychologicalDimension.acronym,
                        },
                    ])).values(),
                ],
            },
            selfMonitoringBlock: f.assessment.selfMonitoringBlock,
            createdAt: f.createdAt,
        }));
        const processing = assessments
            .map((a) => {
            console.log();
            if (a.assessmentResults.length !== a.assessmentFeedbacks.length) {
                return {
                    id: a.id,
                    title: a.title,
                    summary: a.summary,
                    description: a.description,
                };
            }
        })
            .filter((a) => !!a);
        return { items: formattedFeedbacks, processing };
    }
}
exports.DetailFeedbackService = DetailFeedbackService;
