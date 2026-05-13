"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAdminService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class CompanyAdminService {
    async findAll() {
        const companies = await prisma_1.default.company.findMany();
        return companies;
    }
    async findAllFeedbacks(userId) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
                companyId: {
                    not: null,
                },
            },
        });
        if (!(user === null || user === void 0 ? void 0 : user.companyId))
            throw new error_1.PublicError("Usuário não está associado a uma empresa");
        const allFeedbacks = await prisma_1.default.companyAssessmentFeedback.findMany({
            where: {
                companyId: user.companyId,
            },
            include: {
                assessment: true,
            },
        });
        const aux = {};
        allFeedbacks.forEach((f) => {
            const id = f.assessmentId;
            if (!aux[id] || f.createdAt > aux[id].createdAt)
                aux[id] = f;
        });
        return { items: Object.values(aux) };
    }
    async create(data) {
        const company = await prisma_1.default.company.create({ data });
        return company;
    }
    async update({ id, ...data }) {
        const company = await prisma_1.default.company.update({ where: { id }, data });
        return company;
    }
    async setCompanyAssessments({ id: companyId, assessmentIds }) {
        const [company, newAssessments, currentAssessments] = await Promise.all([
            prisma_1.default.company.findFirst({
                where: {
                    id: companyId,
                },
            }),
            prisma_1.default.assessment.findMany({
                where: {
                    id: {
                        in: assessmentIds,
                    },
                },
            }),
            prisma_1.default.companyAvailableAssessment.findMany({ where: { companyId } }),
        ]);
        if (!company)
            throw new Error("Empresa não existe");
        if (assessmentIds.find((id) => !newAssessments.find((assessment) => id === assessment.id))) {
            throw new Error("Um ou mais testes enviados não existem");
        }
        const deletedAssessmentIds = currentAssessments
            .filter((curr) => !assessmentIds.includes(curr.assessmentId))
            .map((item) => item.assessmentId);
        await Promise.all([
            prisma_1.default.companyAvailableAssessment.createMany({
                data: assessmentIds.map((assessmentId) => ({
                    assessmentId,
                    companyId,
                })),
                skipDuplicates: true,
            }),
            prisma_1.default.companyAvailableAssessment.deleteMany({
                where: {
                    assessmentId: {
                        in: deletedAssessmentIds,
                    },
                },
            }),
        ]);
    }
    async generateAllUserFeedback(companyId, sync = true) {
        const company = await prisma_1.default.company.findFirst({
            where: { id: companyId },
            include: {
                users: {
                    select: { id: true },
                },
            },
        });
        if (!company)
            throw new error_1.PublicError("Empresa não encontrada");
        const userIds = company.users.map((u) => u.id);
        if (userIds.length === 0) {
            return {
                companyId,
                queuedCount: 0,
                message: "Empresa sem usuários",
            };
        }
        // Get all assessment results for users in this company
        const allResults = await prisma_1.default.assessmentResult.findMany({
            where: {
                userId: {
                    in: userIds,
                },
            },
            select: {
                id: true,
                userId: true,
                assessmentId: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (allResults.length === 0) {
            return {
                companyId,
                queuedCount: 0,
                message: "Empresa sem resultados de avaliação",
            };
        }
        // Deduplicate: keep only the latest result for each userId + assessmentId pair
        const latestByPair = new Map();
        for (const result of allResults) {
            const key = `${result.userId}#${result.assessmentId}`;
            if (!latestByPair.has(key)) {
                latestByPair.set(key, result);
            }
        }
        const uniquePairs = Array.from(latestByPair.values());
        console.log(`Iniciando geração de feedback para empresa ${companyId}: ${uniquePairs.length} pares usuário+avaliação`);
        // Import AssessmentService dynamically to avoid circular dependency
        const { AssessmentService } = await Promise.resolve().then(() => __importStar(require("../assessment/AssessmentService")));
        const tasks = uniquePairs.map(async (pair) => {
            const generateService = new AssessmentService();
            return generateService.generateUserFeedback({ userId: pair.userId, assessmentId: pair.assessmentId }).catch((error) => {
                console.error(`Erro ao gerar feedback para usuário ${pair.userId} em avaliação ${pair.assessmentId}: `, error instanceof Error ? error.message : String(error));
            });
        });
        if (sync) {
            await Promise.all(tasks);
        }
        return {
            companyId,
            queuedCount: uniquePairs.length,
            message: sync
                ? `${uniquePairs.length} feedbacks gerados com sucesso`
                : `${uniquePairs.length} gerações de feedback enfileiradas com sucesso`,
        };
    }
}
exports.CompanyAdminService = CompanyAdminService;
