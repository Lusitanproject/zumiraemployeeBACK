"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailAssessmentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DetailAssessmentService {
    async execute({ userId, assessmentId }) {
        const assessment = await prisma_1.default.assessment.findFirst({
            where: {
                id: assessmentId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                summary: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        icon: true,
                    },
                },
                assessmentQuestions: {
                    select: {
                        id: true,
                        description: true,
                        index: true,
                        assessmentQuestionChoices: {
                            select: {
                                id: true,
                                label: true,
                                value: true,
                                index: true,
                            },
                        },
                    },
                },
                assessmentResults: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        createdAt: true,
                    },
                },
                nationality: {
                    select: {
                        acronymn: true,
                        name: true,
                    },
                },
            },
        });
        if (!assessment)
            throw new Error("Assessment does not exist");
        const formattedAssesment = {
            id: assessment.id,
            title: assessment.title,
            description: assessment.description,
            assessmensQuestions: assessment.assessmentQuestions,
            selfMonitoringBlock: assessment.selfMonitoringBlock,
            nationality: assessment.nationality,
            lastCompleted: new Date(Math.max(...assessment.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
        };
        return formattedAssesment;
    }
}
exports.DetailAssessmentService = DetailAssessmentService;
