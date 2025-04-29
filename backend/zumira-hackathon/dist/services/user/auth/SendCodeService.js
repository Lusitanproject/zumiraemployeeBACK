"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCodeService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = require("crypto");
async function sendEmail(user, code) {
    const transporter = nodemailer_1.default.createTransport({
        host: "email-ssl.com.br",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const url = "https://www.zumira.com.br/verificar";
    const html = `
  <p>Hello ${user.name},</p>

  <p>Welcome to <strong>Zumira</strong> — your mental health and well-being assistant.</p>

  <p>Your <strong>exclusive access code</strong> is: <strong>${code}</strong></p>

  <p>With it, you can start your self-awareness journey, take psychological assessments, track your emotional progress, and, if you wish, schedule an appointment with professionals from our support network.</p>

  <p>Access the platform through the link below and enter your code to get started:</p>

  <p><a href="${url}">${url}</a></p>

  <p>If you have any questions or need support, we’re here to help.<br />
  Enjoy your experience with Zumira!</p>

  <p>With love,<br />
  <strong>The Zumira Team</strong></p>
`;
    try {
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Your Access Code to the Zumira Platform",
            html: html,
        });
    }
    catch (err) {
        if (err instanceof Error)
            console.log("Error sending email", err.message);
        throw new Error("Error sending email");
    }
}
class SendCodeService {
    async execute(email) {
        if (!email)
            throw new Error("Email is missing");
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user)
            throw new Error("Email is not registered");
        const code = (0, crypto_1.randomInt)(100000, 999999).toString();
        const now = new Date().getTime();
        const expiresAt = new Date(now + 5 * 60 * 1000); // Expiração em 5 minutos
        await sendEmail(user, code);
        await prisma_1.default.authCode.create({
            data: {
                userId: user.id,
                code: code,
                expiresAt: expiresAt,
            },
        });
        if (process.env.PRODUCTION !== "true")
            console.log(`Sent code ${code} to ${email}`);
        return {};
    }
}
exports.SendCodeService = SendCodeService;
