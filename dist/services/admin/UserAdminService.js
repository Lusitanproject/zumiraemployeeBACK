"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const error_1 = require("../../error");
class UserAdminService {
    async find(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                role: {
                    select: {
                        id: true,
                        slug: true,
                    },
                },
            },
        });
        return user;
    }
    async findBy({ id, email, phoneNumber }) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id,
                email,
                phoneNumber,
            },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const { password, roleId, companyId, nationalityId, currentActChatbotId, ...response } = user;
        return response;
    }
    async findAll() {
        const users = await prisma_1.default.user.findMany({
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                role: {
                    select: {
                        id: true,
                        slug: true,
                    },
                },
            },
        });
        return users;
    }
    // Busca um usuário que possua o email informado
    async findByEmail(email) {
        const user = await prisma_1.default.user.findFirst({
            where: { email },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                role: {
                    select: {
                        id: true,
                        slug: true,
                    },
                },
            },
        });
        return user;
    }
    // Lista todos os usuários que pertencem a empresa informada
    async findByCompany(companyId) {
        const users = await prisma_1.default.user.findMany({
            where: { companyId },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                role: {
                    select: {
                        id: true,
                        slug: true,
                    },
                },
            },
        });
        return users;
    }
    async create(data) {
        const firstAct = await prisma_1.default.actChatbot.findFirst({
            orderBy: {
                index: "asc",
            },
        });
        const user = await prisma_1.default.user.create({
            data: {
                ...data,
                currentActChatbotId: firstAct === null || firstAct === void 0 ? void 0 : firstAct.id,
            },
        });
        return user;
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
            orderBy: {
                index: "asc",
            },
        });
        const result = await prisma_1.default.user.createMany({
            data: data.map((d) => ({ ...d, currentActChatbotId: firstAct === null || firstAct === void 0 ? void 0 : firstAct.id })),
        });
        return result;
    }
    async update({ id, ...data }) {
        const user = await prisma_1.default.user.update({
            where: { id },
            data,
        });
        return user;
    }
    async delete(id) {
        await prisma_1.default.user.delete({ where: { id } });
    }
}
exports.UserAdminService = UserAdminService;
