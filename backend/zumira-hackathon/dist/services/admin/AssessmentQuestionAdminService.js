"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentQuestionAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class AssessmentQuestionAdminService {
    async findByAssessment(assessmentId) {
        const questions = await prisma_1.default.assessmentQuestion.findMany({
            where: { assessmentId },
            select: {
                id: true,
                index: true,
                assessmentId: true,
                description: true,
                updatedAt: true,
                psychologicalDimension: {
                    select: {
                        id: true,
                        acronym: true,
                        name: true,
                    },
                },
                assessmentQuestionChoices: {
                    select: {
                        id: true,
                        index: true,
                        label: true,
                        value: true,
                    },
                },
            },
        });
        return questions;
    }
}
exports.AssessmentQuestionAdminService = AssessmentQuestionAdminService;
