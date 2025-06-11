"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAdminService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class CompanyAdminService {
    async find(companyId) {
        const company = await prisma_1.default.company.findFirst({
            where: { id: companyId },
        });
        return company;
    }
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
}
exports.CompanyAdminService = CompanyAdminService;
