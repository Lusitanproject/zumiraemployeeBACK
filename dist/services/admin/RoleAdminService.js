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
        });
        return role;
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
}
exports.RoleAdminService = RoleAdminService;
