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
