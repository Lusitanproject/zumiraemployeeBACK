import { User } from "@prisma/client";
import { verify } from "argon2";
import { randomInt } from "crypto";
import { sign } from "jsonwebtoken";
import nodemailer from "nodemailer";

import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { AuthUserRequest } from "../../schemas/user";
import { devLog } from "../../utils/devLog";

async function authByPassword(user: User, password: string) {
  const passwordMatch = user.password ? await verify(user.password, password) : false;
  if (!passwordMatch) throw new PublicError("Usuário ou senha inválidos");
}

async function authByCode(user: User, code: string) {
  const storedCode = await prismaClient.authCode.findFirst({
    where: { userId: user.id, code },
  });

  if (!storedCode || storedCode.expiresAt < new Date()) throw new PublicError("Código inválido ou expirado");
}

async function sendEmail(user: User, code: string) {
  const transporter = nodemailer.createTransport({
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
      from: { name: "Zumira", address: process.env.EMAIL_USER! },
      to: user.email,
      subject: "Seu código de acesso à plataforma Zumira",
      html,
    });
  } catch (err) {
    throw new Error(`Erro ao enviar e-mail: ${err}`);
  }
}

class AuthService {
  async auth({ email, password, code }: AuthUserRequest) {
    const user = await prismaClient.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) throw new PublicError("E-mail não cadastrado");

    if (!password && !code) {
      throw new PublicError("Por favor informe o código de autênticação ou senha");
    }

    if (password) await authByPassword(user, password);
    if (code) await authByCode(user, code);

    const token = sign({ email: user.email }, process.env.JWT_SECRET!, {
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

  async sendCode(email: string) {
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) throw new PublicError("Email não cadastrado");

    const code = randomInt(100000, 999999).toString();
    const now = new Date().getTime();
    const expiresAt = new Date(now + 5 * 60 * 1000);

    await sendEmail(user, code);

    await prismaClient.authCode.create({
      data: { userId: user.id, code, expiresAt },
    });

    devLog(`Sent code ${code} to ${email}`);

    return {};
  }
}

export { AuthService };
