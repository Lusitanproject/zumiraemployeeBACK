"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const UserAdminService_1 = require("../admin/UserAdminService");
class CompanyService {
    async findFeedback({ assessmentId, companyId }) {
        const feedback = await prisma_1.default.companyAssessmentFeedback.findFirst({
            where: { companyId, assessmentId },
            select: { text: true, respondents: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        });
        return feedback;
    }
    async find(companyId) {
        const company = await prisma_1.default.company.findFirst({
            where: { id: companyId },
            include: {
                companyAvailableAssessments: {
                    select: { assessmentId: true },
                },
            },
        });
        return company;
    }
    async createUserForCompany(requesterId, data) {
        const requester = await prisma_1.default.user.findFirst({ where: { id: requesterId } });
        if (!(requester === null || requester === void 0 ? void 0 : requester.companyId))
            throw new error_1.PublicError("Usuário não está associado a uma empresa");
        return new UserAdminService_1.UserAdminService().create({ ...data, companyId: requester.companyId });
    }
    async createManyUsersForCompany(requesterId, data) {
        const requester = await prisma_1.default.user.findFirst({ where: { id: requesterId } });
        if (!(requester === null || requester === void 0 ? void 0 : requester.companyId))
            throw new error_1.PublicError("Usuário não está associado a uma empresa");
        const companyId = requester.companyId;
        return new UserAdminService_1.UserAdminService().createMany(data.map((u) => ({ ...u, companyId })));
    }
}
exports.CompanyService = CompanyService;
