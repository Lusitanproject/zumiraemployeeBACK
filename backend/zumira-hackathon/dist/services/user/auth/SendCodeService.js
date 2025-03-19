"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCodeService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = require("crypto");
async function sendEmail(email, code) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    try {
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Código de login",
            text: `Seu código é ${code}`,
        });
    }
    catch (err) {
        console.log("Error sending email", err.message);
        throw new Error("Error sending email");
    }
}
class SendCodeService {
    async execute(email) {
        if (!email)
            throw new Error("Email is missing");
        const storedEmail = await prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!storedEmail)
            throw new Error("Email is not registered");
        const code = (0, crypto_1.randomInt)(100000, 999999).toString();
        const now = new Date().getTime();
        const expiresAt = new Date(now + 5 * 60 * 1000); // Expiração em 5 minutos
        await sendEmail(email, code);
        await prisma_1.default.authCode.create({
            data: {
                userId: storedEmail.id,
                code: code,
                expiresAt: expiresAt,
            },
        });
        console.log(`Sent code ${code} to ${email}`);
        return {};
    }
}
exports.SendCodeService = SendCodeService;
