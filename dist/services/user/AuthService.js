"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const argon2_1 = require("argon2");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const nodemailer_1 = __importDefault(require("nodemailer"));
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const devLog_1 = require("../../utils/devLog");
async function authByPassword(user, password) {
    const passwordMatch = user.password ? await (0, argon2_1.verify)(user.password, password) : false;
    if (!passwordMatch)
        throw new error_1.PublicError("Usuário ou senha inválidos");
}
async function authByCode(user, code) {
    const storedCode = await prisma_1.default.authCode.findFirst({
        where: { userId: user.id, code },
    });
    if (!storedCode || storedCode.expiresAt < new Date())
        throw new error_1.PublicError("Código inválido ou expirado");
}
async function sendEmail(user, code) {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const html = `
    <p>Olá ${user.name},</p>

    <p>Bem-vindo à <strong>Zumira</strong> — sua assistente de saúde mental e bem-estar.</p>

    <p>Seu <strong>código exclusivo de acesso</strong> é: <strong>${code}</strong></p>

    <p>Se tiver dúvidas ou precisar de suporte, você pode enviar e-mail para <a href="mailto:support@zumira.ai">support@zumira.ai</a></p>

    <p>Aproveite sua experiência com a Zumira!</p>

    <p>Com carinho,<br />
    <strong>Equipe Zumira</strong></p>
  `;
    try {
        await transporter.sendMail({
            from: { name: "Zumira", address: process.env.EMAIL_USER },
            to: user.email,
            subject: "Seu código de acesso à plataforma Zumira",
            html,
        });
    }
    catch (err) {
        throw new Error(`Erro ao enviar e-mail: ${err}`);
    }
}
class AuthService {
    async auth({ email, password, code }) {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user)
            throw new error_1.PublicError("E-mail não cadastrado");
        if (!password && !code) {
            throw new error_1.PublicError("Por favor informe o código de autênticação ou senha");
        }
        if (password)
            await authByPassword(user, password);
        if (code)
            await authByCode(user, code);
        const token = (0, jsonwebtoken_1.sign)({ email: user.email }, process.env.JWT_SECRET, {
            subject: String(user.id),
            expiresIn: "30d",
        });
        const now = new Date().getTime();
        const expiresAt = new Date(now + 1000 * 60 * 60 * 24 * 30);
        return {
            name: user.name,
            gender: user.gender,
            act: user.currentActChatbotId,
            role: user.role.slug,
            token,
            expiresAt,
            user: (() => {
                const { password, ...response } = user;
                return { ...response };
            })(),
        };
    }
    async sendCode(email) {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new error_1.PublicError("Email não cadastrado");
        const code = (0, crypto_1.randomInt)(100000, 999999).toString();
        const now = new Date().getTime();
        const expiresAt = new Date(now + 5 * 60 * 1000);
        await sendEmail(user, code);
        await prisma_1.default.authCode.create({
            data: { userId: user.id, code, expiresAt },
        });
        (0, devLog_1.devLog)(`Sent code ${code} to ${email}`);
        return {};
    }
}
exports.AuthService = AuthService;
