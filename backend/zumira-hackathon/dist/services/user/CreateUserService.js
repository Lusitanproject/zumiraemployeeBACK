"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateUserService {
    async execute(data) {
        const userExists = await prisma_1.default.user.findFirst({
            where: {
                email: data.email,
            },
        });
        if (userExists)
            throw new Error("User already exists");
        const role = await prisma_1.default.role.findFirst({
            where: {
                slug: "user",
            },
        });
        if (!role)
            throw new Error("Internal error");
        const user = await prisma_1.default.user.create({
            data: {
                ...data,
                roleId: role.id,
            },
        });
        return user;
    }
}
exports.CreateUserService = CreateUserService;
