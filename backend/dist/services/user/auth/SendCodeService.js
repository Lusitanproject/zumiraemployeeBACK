"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCodeService = void 0;
const crypto_1 = require("crypto");
const nodemailer_1 = __importDefault(require("nodemailer"));
const error_1 = require("../../../error");
const prisma_1 = __importDefault(require("../../../prisma"));
const devLog_1 = require("../../../utils/devLog");
async function sendEmail(user, code) {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const url = "https://www.zumira.com.br/verificar";
    const html = `
  <p>Olá ${user.name},</p>

  <p>Bem-vindo à <strong>Zumira</strong> — sua assistente de saúde mental e bem-estar.</p>

  <p>Seu <strong>código exclusivo de acesso</strong> é: <strong>${code}</strong></p>

  <p>Com ele, você pode iniciar sua jornada de autoconhecimento, realizar avaliações psicológicas, acompanhar seu progresso emocional e, se desejar, agendar uma consulta com profissionais da nossa rede de apoio.</p>

  <p>Acesse a plataforma pelo link abaixo e insira seu código para começar:</p>

  <p><a href="${url}">${url}</a></p>

  <p>Se tiver dúvidas ou precisar de suporte, estamos aqui para ajudar.<br />
  Aproveite sua experiência com a Zumira!</p>

  <p>Com carinho,<br />
  <strong>Equipe Zumira</strong></p>
`;
    try {
        await transporter.sendMail({
            from: {
                name: "Zumira",
                address: process.env.EMAIL_USER,
            },
            to: user.email,
            subject: "Seu código de acesso à plataforma Zumira",
            html: html,
        });
    }
    catch (err) {
        if (err instanceof Error)
            (0, devLog_1.devLog)(`Error sending email to ${user.email}`, err.message);
        throw new Error("Erro ao enviar e-mail");
    }
}
class SendCodeService {
    async execute(email) {
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user)
            throw new error_1.PublicError("Email não cadastrado");
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
        (0, devLog_1.devLog)(`Sent code ${code} to ${email}`);
        return {};
    }
}
exports.SendCodeService = SendCodeService;
