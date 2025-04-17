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
                feedbackInstructions: true,
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
}
exports.AssessmentAdminService = AssessmentAdminService;
