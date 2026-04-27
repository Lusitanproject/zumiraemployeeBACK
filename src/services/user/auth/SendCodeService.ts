import { User } from "@prisma/client";
import { randomInt } from "crypto";
import nodemailer from "nodemailer";

import { PublicError } from "../../../error";
import prismaClient from "../../../prisma";
import { devLog } from "../../../utils/devLog";

async function sendEmail(user: User, code: string) {
  const transporter = nodemailer.createTransport({
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

    <p>Se tiver dúvidas ou precisar de suporte, você pode enviar e-mail para <a href="mailto:support@zumira.ai">support@zumira.ai</a></p>

    <p>Aproveite sua experiência com a Zumira!</p>

    <p>Com carinho,<br />
    <strong>Equipe Zumira</strong></p>
  `;

  try {
    await transporter.sendMail({
      from: {
        name: "Zumira",
        address: process.env.EMAIL_USER!,
      },
      to: user.email,
      subject: "Seu código de acesso à plataforma Zumira",
      html: html,
    });
  } catch (err) {
    if (err instanceof Error) devLog(`Error sending email to ${user.email}`, err.message);
    throw new Error("Erro ao enviar e-mail");
  }
}

class SendCodeService {
  async execute(email: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new PublicError("Email não cadastrado");

    const code = randomInt(100000, 999999).toString();

    const now = new Date().getTime();
    const expiresAt = new Date(now + 5 * 60 * 1000); // Expiração em 5 minutos

    await sendEmail(user, code);

    await prismaClient.authCode.create({
      data: {
        userId: user.id,
        code: code,
        expiresAt: expiresAt,
      },
    });

    devLog(`Sent code ${code} to ${email}`);

    return {};
  }
}

export { SendCodeService };
