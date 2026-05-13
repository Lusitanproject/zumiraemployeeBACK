"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailResultService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class DetailResultService {
    async execute({ userId, assessmentId }) {
        const result = await prisma_1.default.assessmentResult.findFirst({
            where: {
                userId,
                assessmentId,
            },
            select: {
                id: true,
                feedback: true,
                assessmentResultRating: {
                    select: {
                        risk: true,
                        profile: true,
                        color: true,
                    },
                },
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        description: true,
                        nationality: {
                            select: {
                                name: true,
                                acronym: true,
                            },
                        },
                        selfMonitoringBlock: {
                            select: {
                                id: true,
                                icon: true,
                                title: true,
                                summary: true,
                                psychologicalDimensions: {
                                    select: {
                                        acronym: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                assessmentQuestionAnswers: {
                    select: {
                        assessmentQuestionChoice: {
                            select: {
                                label: true,
                                value: true,
                                index: true,
                            },
                        },
                        assessmentQuestion: {
                            select: {
                                description: true,
                                index: true,
                                psychologicalDimension: {
                                    select: {
                                        name: true,
                                        acronym: true,
                                    },
                                },
                            },
                        },
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!result)
            throw new error_1.PublicError("Nenhum resultado para esta avaliação");
        const dimensions = {};
        result.assessmentQuestionAnswers.forEach((q) => {
            const dimension = q.assessmentQuestion.psychologicalDimension;
            const id = dimension.acronym + dimension.name;
            dimensions[id] = dimension;
        });
        return { ...result, psychologicalDimensions: Object.values(dimensions) };
    }
}
exports.DetailResultService = DetailResultService;
