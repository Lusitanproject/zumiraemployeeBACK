"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class RoleAdminService {
    async find(roleId) {
        const role = await prisma_1.default.role.findUnique({
            where: { id: roleId },
            include: { rolePermissions: { select: { permission: true } } },
        });
        if (!role)
            return null;
        const { rolePermissions, ...rest } = role;
        return { ...rest, permissions: rolePermissions.map((p) => p.permission) };
    }
    async findAll() {
        const role = await prisma_1.default.role.findMany();
        return role;
    }
    async findBySlug(slug) {
        const role = await prisma_1.default.role.findUnique({
            where: { slug },
        });
        return role;
    }
    async create(slug) {
        const role = await prisma_1.default.role.create({
            data: { slug },
        });
        return role;
    }
    async update({ id, slug }) {
        return await prisma_1.default.role.update({ where: { id }, data: { slug } });
    }
    async delete(id) {
        return await prisma_1.default.role.delete({ where: { id } });
    }
    async setPermissions(roleId, permissions) {
        await prisma_1.default.$transaction([
            prisma_1.default.rolePermission.deleteMany({ where: { roleId } }),
            prisma_1.default.rolePermission.createMany({
                data: permissions.map((permission) => ({ roleId, permission })),
            }),
        ]);
    }
}
exports.RoleAdminService = RoleAdminService;
