"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class AssessmentAdminService {
    async find(assessmentId) {
        const assessment = await prisma_1.default.assessment.findUnique({
            where: { id: assessmentId },
            select: {
                id: true,
                title: true,
                description: true,
                summary: true,
                selfMonitoringBlockId: true,
                userFeedbackInstructions: true,
                companyFeedbackInstructions: true,
                operationType: true,
                nationalityId: true,
            },
        });
        return assessment;
    }
    async update({ id, ...data }) {
        const assessment = await prisma_1.default.assessment.update({
            where: { id },
            data,
        });
        return assessment;
    }
    async duplicate(assessmentId) {
        const assessment = await prisma_1.default.assessment.findFirst({
            where: { id: assessmentId },
            include: {
                assessmentQuestions: {
                    include: {
                        assessmentQuestionChoices: true,
                    },
                },
                assessmentResultRatings: true,
            },
        });
        if (!assessment)
            throw new Error("Assessment does not exist");
        const originalTitle = assessment.title.replace(/\s\(\d+\)$/, ""); // Remove o número de clone "(x)"
        const existingClones = (await prisma_1.default.$queryRaw `
      SELECT title FROM assessments 
      WHERE title LIKE ${originalTitle + " (%)"} OR title = ${originalTitle}
    `);
        const nextNumber = existingClones
            .map((c) => {
            const match = c.title.match(/\((\d+)\)$/);
            return match ? parseInt(match[1], 10) : 0;
        })
            .reduce((max, n) => (n > max ? n : max), 0) + 1;
        const newTitle = `${originalTitle} (${nextNumber})`;
        const clone = await prisma_1.default.assessment.create({
            data: {
                title: newTitle,
                summary: assessment.summary,
                companyFeedbackInstructions: assessment.companyFeedbackInstructions,
                userFeedbackInstructions: assessment.userFeedbackInstructions,
                description: assessment.description,
                nationalityId: assessment.nationalityId,
                operationType: assessment.operationType,
                selfMonitoringBlockId: assessment.selfMonitoringBlockId,
                assessmentQuestions: {
                    create: assessment.assessmentQuestions.map((q) => ({
                        index: q.index,
                        description: q.description,
                        psychologicalDimensionId: q.psychologicalDimensionId,
                        assessmentQuestionChoices: {
                            create: q.assessmentQuestionChoices.map((c) => ({
                                index: c.index,
                                label: c.label,
                                value: c.value,
                            })),
                        },
                    })),
                },
                assessmentResultRatings: {
                    create: assessment.assessmentResultRatings.map((r) => ({
                        color: r.color,
                        profile: r.profile,
                        risk: r.risk,
                    })),
                },
            },
            select: {
                id: true,
                title: true,
                summary: true,
                companyFeedbackInstructions: true,
                userFeedbackInstructions: true,
                description: true,
                nationalityId: true,
                operationType: true,
                selfMonitoringBlockId: true,
            },
        });
        return clone;
    }
    async delete(assessmentId) {
        await prisma_1.default.assessment.delete({ where: { id: assessmentId } });
    }
}
exports.AssessmentAdminService = AssessmentAdminService;
