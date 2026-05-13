"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const error_1 = require("../../error");
class UserAdminService {
    async create(data) {
        const firstAct = await prisma_1.default.actChatbot.findFirst({
            orderBy: { index: "asc" },
        });
        const user = await prisma_1.default.user.create({
            data: {
                ...data,
                currentActChatbotId: firstAct === null || firstAct === void 0 ? void 0 : firstAct.id,
            },
        });
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async createMany(data) {
        const { companyId } = data[0];
        const allSameCompany = data.every((u) => u.companyId === companyId);
        if (!allSameCompany)
            throw new error_1.PublicError("Todos os usuários cadastrados em lote devem ser da mesma empresa");
        const company = companyId
            ? await prisma_1.default.company.findFirst({
                where: { id: companyId },
                include: { trail: true },
            })
            : null;
        if (companyId && !company)
            throw new error_1.PublicError("Empresa não encontrada");
        const firstAct = await prisma_1.default.actChatbot.findFirst({
            where: company ? { trailId: company.trail.id } : undefined,
            orderBy: { index: "asc" },
        });
        const result = await prisma_1.default.user.createMany({
            data: data.map((d) => ({ ...d, currentActChatbotId: firstAct === null || firstAct === void 0 ? void 0 : firstAct.id })),
        });
        return result;
    }
}
exports.UserAdminService = UserAdminService;
