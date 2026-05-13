"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompanyAssessmentsService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class ListCompanyAssessmentsService {
    async execute(userId) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                companyId: true,
            },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não existe");
        if (!user.companyId)
            throw new error_1.PublicError("Usuário não está associado a uma empresa");
        return this.findAssessmentsByCompanyAndUser(user.companyId, userId);
    }
    async findAssessmentsByCompanyAndUser(companyId, userId) {
        const assessments = await prisma_1.default.assessment.findMany({
            where: {
                companyAvailableAssessments: {
                    some: {
                        companyId,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                summary: true,
                public: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                assessmentResults: {
                    where: {
                        userId,
                    },
                    select: {
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                title: "asc",
            },
        });
        const formattedAssessments = assessments.map((a) => {
            const hasResults = a.assessmentResults.length > 0;
            return {
                id: a.id,
                title: a.title,
                summary: a.summary,
                public: a.public,
                selfMonitoring: a.selfMonitoringBlock,
                lastCompleted: hasResults
                    ? new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime())))
                    : null,
            };
        });
        return { assessments: formattedAssessments };
    }
}
exports.ListCompanyAssessmentsService = ListCompanyAssessmentsService;
