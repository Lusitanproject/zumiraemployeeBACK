import { sign } from "jsonwebtoken";

import { PublicError } from "../../../error";
import prismaClient from "../../../prisma";
import { AuthUserRequest } from "../../../definitions/user";
import { User } from "@prisma/client";
import { verify } from "argon2";

async function authByPassword(user: User, password: string) {
  const passwordMatch = user.password ? await verify(user.password, password) : false;
  if (!passwordMatch) throw new PublicError("Usuário ou senha inválidos");
}

async function authByCode(user: User, code: string) {
  const storedCode = await prismaClient.authCode.findFirst({
    where: {
      userId: user.id,
      code,
    },
  });

  if (!storedCode || storedCode.expiresAt < new Date()) throw new PublicError("Código inválido ou expirado");
}

class AuthUserService {
  async execute({ email, password, code }: AuthUserRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new PublicError("E-mail não cadastrado");
    }

    if (!password && !code) {
      throw new PublicError("Por favor informe o código de autênticação ou senha");
    }

    if (password) {
      await authByPassword(user, password);
    }

    if (code) {
      await authByCode(user, code);
    }

    const token = sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        subject: String(user.id),
        expiresIn: "30d",
      }
    );
    const now = new Date().getTime();
    const expiresAt = new Date(now + 1000 * 60 * 60 * 24 * 30); // Expiração em 30 dias

    return {
      name: user.name,
      gender: user.gender,
      act: user.currentActChatbotId,
      role: user.role.slug,
      token: token,
      expiresAt: expiresAt,
    };
  }
}

export { AuthUserService };
