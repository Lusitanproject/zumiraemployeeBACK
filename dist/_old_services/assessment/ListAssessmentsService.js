"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAssessmentsService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class ListAssessmentsService {
    async execute({ userId, nationalityId }) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não existe");
        const assessments = await prisma_1.default.assessment.findMany({
            where: {
                nationalityId, // Ignorado se for undefined
                public: true,
                companyAvailableAssessments: user.companyId
                    ? {
                        some: {
                            companyId: user.companyId,
                        },
                    }
                    : undefined,
            },
            select: {
                id: true,
                title: true,
                summary: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true,
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
            },
        });
        const formattedAssessments = assessments.map((a) => ({
            id: a.id,
            title: a.title,
            summary: a.summary,
            selfMonitoring: a.selfMonitoringBlock,
            lastCompleted: new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
        }));
        return { assessments: formattedAssessments };
    }
}
exports.ListAssessmentsService = ListAssessmentsService;
