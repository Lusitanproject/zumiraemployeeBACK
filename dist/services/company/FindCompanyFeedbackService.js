"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCompanyFeedbackService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class FindCompanyFeedbackService {
    async execute({ assessmentId, companyId }) {
        const feedback = await prisma_1.default.companyAssessmentFeedback.findFirst({
            where: {
                companyId,
                assessmentId,
            },
            select: {
                text: true,
                respondents: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return feedback;
    }
}
exports.FindCompanyFeedbackService = FindCompanyFeedbackService;
