"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentDetailForAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class AssessmentDetailForAdminService {
    async execute({ assessmentId }) {
        const assessment = await prisma_1.default.assessment.findUnique({
            where: { id: assessmentId },
            select: {
                id: true,
                title: true,
                description: true,
                summary: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true
                    }
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
            },
        });
        if (!assessment)
            throw new Error("Assessment does not exist");
        return assessment;
    }
}
exports.AssessmentDetailForAdminService = AssessmentDetailForAdminService;
