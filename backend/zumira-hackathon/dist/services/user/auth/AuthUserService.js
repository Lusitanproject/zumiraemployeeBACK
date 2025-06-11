"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const error_1 = require("../../../error");
const prisma_1 = __importDefault(require("../../../prisma"));
class AuthUserService {
    async execute({ email, code }) {
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
            include: {
                role: true,
            },
        });
        if (!user)
            throw new error_1.PublicError("E-mail não cadastrado");
        const storedCode = await prisma_1.default.authCode.findFirst({
            where: {
                userId: user.id,
                code,
            },
        });
        if (!storedCode || storedCode.expiresAt < new Date())
            throw new error_1.PublicError("Código inválido ou expirado");
        const token = (0, jsonwebtoken_1.sign)({
            email: user.email,
        }, process.env.JWT_SECRET, {
            subject: String(user.id),
            expiresIn: "30d",
        });
        const now = new Date().getTime();
        const expiresAt = new Date(now + 1000 * 60 * 60 * 24 * 30); // Expiração em 30 dias
        return {
            name: user.name,
            act: user.currentActChatbotId,
            role: user.role.slug,
            token: token,
            expiresAt: expiresAt,
        };
    }
}
exports.AuthUserService = AuthUserService;
