"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../prisma"));
async function getUserData(userId) {
    const user = await prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            role: {
                include: {
                    rolePermissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    });
    if (!user)
        throw new Error("User does not exist");
    return {
        id: user.id,
        role: user.role.slug,
        permissions: user.role.rolePermissions.map((p) => p.permission.slug),
        currentChatbotId: user.currentActChatbotId,
    };
}
async function isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).end();
    }
    const [, token] = authToken.split(" ");
    try {
        // Validar o token
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // Recuperar o id do token e armazenar numa variavel user dentro de req
        const userId = sub;
        req.user = await getUserData(userId);
        return next();
    }
    catch {
        return res.status(401).end();
    }
}
