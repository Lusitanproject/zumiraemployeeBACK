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
        if (!user)
            return null;
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async findBy({ id, email, customId, phoneNumber }) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id,
                email,
                customId,
                phoneNumber,
            },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const { password: _password, ...response } = user;
        return { ...response };
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
        return users.map((user) => {
            const { password: _password, ...response } = user;
            return { ...response };
        });
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
        if (!user)
            return null;
        const { password: _password, ...response } = user;
        return { ...response };
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
        return users.map((user) => {
            const { password: _password, ...response } = user;
            return { ...response };
        });
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
        const { password: _password, ...response } = user;
        return { ...response };
    }
    async getFilters(columns, userIds) {
        const result = {};
        const idFilter = userIds ? { id: { in: userIds } } : {};
        const SCALAR_COLUMNS = [
            "gender",
            "occupation",
            "occupationLevel",
            "area",
            "location",
            "skinColor",
            "hasDisability",
        ];
        await Promise.all(columns.map(async (col) => {
            if (SCALAR_COLUMNS.includes(col)) {
                const rows = await prisma_1.default.user.findMany({
                    select: { [col]: true },
                    distinct: [col],
                    where: { ...idFilter, [col]: { not: null } },
                    orderBy: { [col]: "asc" },
                });
                result[col] = rows.map((r) => r[col]);
            }
            else if (col === "roleId") {
                const rows = await prisma_1.default.user.findMany({
                    select: { role: { select: { id: true, slug: true } } },
                    distinct: ["roleId"],
                    where: idFilter,
                    orderBy: { role: { slug: "asc" } },
                });
                result[col] = rows.map((r) => r.role);
            }
            else if (col === "companyId") {
                const rows = await prisma_1.default.user.findMany({
                    select: { company: { select: { id: true, name: true } } },
                    distinct: ["companyId"],
                    where: { ...idFilter, companyId: { not: null } },
                    orderBy: { company: { name: "asc" } },
                });
                result[col] = rows.map((r) => r.company);
            }
            else if (col === "nationalityId") {
                const rows = await prisma_1.default.user.findMany({
                    select: { nationality: { select: { id: true, name: true } } },
                    distinct: ["nationalityId"],
                    where: { ...idFilter, nationalityId: { not: null } },
                    orderBy: { nationality: { name: "asc" } },
                });
                result[col] = rows.map((r) => r.nationality);
            }
        }));
        return result;
    }
    async search({ page, pageSize, search, companyId, roleId, gender, occupation, occupationLevel, area, location, skinColor, hasDisability, nationalityId, }) {
        const where = {
            ...(companyId && { companyId }),
            ...(roleId && { roleId }),
            ...(gender && { gender }),
            ...(occupation && { occupation: { contains: occupation, mode: "insensitive" } }),
            ...(occupationLevel && { occupationLevel: { contains: occupationLevel, mode: "insensitive" } }),
            ...(area && { area: { contains: area, mode: "insensitive" } }),
            ...(location && { location: { contains: location, mode: "insensitive" } }),
            ...(skinColor && { skinColor: { contains: skinColor, mode: "insensitive" } }),
            ...(hasDisability !== undefined && { hasDisability }),
            ...(nationalityId && { nationalityId }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }),
        };
        const skip = (page - 1) * pageSize;
        const [total, rawUsers] = await prisma_1.default.$transaction([
            prisma_1.default.user.count({ where }),
            prisma_1.default.user.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    company: { select: { id: true, name: true } },
                    role: { select: { id: true, slug: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);
        const users = rawUsers.map(({ password: _p, ...u }) => u);
        return {
            users,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async delete(id) {
        await prisma_1.default.user.delete({ where: { id } });
    }
}
exports.UserAdminService = UserAdminService;
