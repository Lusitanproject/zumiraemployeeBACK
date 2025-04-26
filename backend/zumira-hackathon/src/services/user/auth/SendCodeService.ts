import prismaClient from "../../../prisma";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { User } from "@prisma/client";

async function sendEmail(user: User, code: string) {
  const transporter = nodemailer.createTransport({
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
    <p>Olá ${user.name},</p>

    <p>Seja bem-vindo(a) à <strong>Zumira</strong> - sua assistente de saúde mental e bem estar.</p>

    <p>Seu <strong>código de acesso exclusivo</strong> é: <strong>${code}</strong></p>

    <p>Com ele, você poderá iniciar sua jornada de autoconhecimento, realizar testes psicológicos, acompanhar sua evolução emocional e, se desejar, agendar um atendimento com profissionais da nossa rede de apoio.</p>

    <p>Acesse a plataforma pelo link abaixo e insira seu código para começar:</p>

    <p><a href="${url}">${url}</a></p>

    <p>Se tiver qualquer dúvida ou precisar de suporte, estamos por aqui para te ajudar.<br />
    Boa experiência com a Zumira!</p>

    <p>Com carinho,<br />
    <strong>Equipe Zumira</strong></p>
  `;

  try {
    await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Seu Código de Acesso à Plataforma Zumira",
      html: html,
    });
  } catch (err) {
    if (err instanceof Error) console.log("Error sending email", err.message);
    throw new Error("Error sending email");
  }
}

class SendCodeService {
  async execute(email: string) {
    if (!email) throw new Error("Email is missing");

    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new Error("Email is not registered");

    const code = randomInt(100000, 999999).toString();

    const now = new Date().getTime();
    const expiresAt = new Date(now + 5 * 60 * 1000); // Expiração em 5 minutos

    sendEmail(user, code).then(async () => {
      await prismaClient.authCode.create({
        data: {
          userId: user.id,
          code: code,
          expiresAt: expiresAt,
        },
      });

      if (process.env.PRODUCTION !== "true") console.log(`Sent code ${code} to ${email}`);
    });

    return {};
  }
}

export { SendCodeService };
