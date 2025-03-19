"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateUserService {
    async execute({ name, email, role, companyId }) {
        const userExists = await prisma_1.default.user.findFirst({
            where: {
                email: email,
            },
        });
        if (userExists)
            throw new Error("User already exists");
        const companyExists = await prisma_1.default.company.findFirst({
            where: {
                id: companyId,
            },
        });
        if (!companyExists)
            throw new Error("Company does not exist");
        const roleExists = await prisma_1.default.role.findFirst({
            where: {
                slug: role,
            },
        });
        if (!roleExists)
            throw new Error(`Role does not exist`);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                roleId: roleExists.id,
                companyId,
            },
        });
        return user;
    }
}
exports.CreateUserService = CreateUserService;
