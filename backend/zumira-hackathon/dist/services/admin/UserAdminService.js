"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UserAdminService {
    async find(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                role: {
                    select: {
                        id: true,
                        slug: true
                    }
                }
            }
        });
        return user;
    }
    async findAll() {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                role: {
                    select: {
                        id: true,
                        slug: true
                    }
                }
            }
        });
        return users;
    }
    // Busca um usuário que possua o email informado
    async findByEmail(email) {
        const user = await prisma_1.default.user.findFirst({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                role: {
                    select: {
                        id: true,
                        slug: true
                    }
                }
            }
        });
        return user;
    }
    // Lista todos os usuários que pertencem a empresa informada
    async findByCompany(companyId) {
        const users = await prisma_1.default.user.findMany({
            where: { companyId },
            select: {
                id: true,
                name: true,
                email: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                role: {
                    select: {
                        id: true,
                        slug: true
                    }
                }
            }
        });
        return users;
    }
    async create(data) {
        const user = await prisma_1.default.user.create({
            data
        });
        return user;
    }
    async update({ id, ...data }) {
        const user = await prisma_1.default.user.update({
            where: { id },
            data
        });
        return user;
    }
}
exports.UserAdminService = UserAdminService;
