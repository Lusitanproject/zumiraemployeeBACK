"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAdminService = void 0;
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
            throw new Error("User is not associated with a company");
        const feedbacks = await prisma_1.default.companyAssessmentFeedback.findMany({
            where: {
                companyId: user.companyId,
            },
            include: {
                assessment: true,
            },
        });
        return { items: feedbacks };
    }
    async create(data) {
        const company = await prisma_1.default.company.create({ data });
        return company;
    }
}
exports.CompanyAdminService = CompanyAdminService;
