import { sign } from "jsonwebtoken";

import { PublicError } from "../../../error";
import prismaClient from "../../../prisma";

interface AuthRequest {
  code: string;
  email: string;
}

class AuthUserService {
  async execute({ email, code }: AuthRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new PublicError("E-mail não cadastrado");

    const storedCode = await prismaClient.authCode.findFirst({
      where: {
        userId: user.id,
        code,
      },
    });

    if (!storedCode || storedCode.expiresAt < new Date()) throw new PublicError("Código inválido ou expirado");

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
      act: user.currentActChatbotId,
      role: user.role.slug,
      token: token,
      expiresAt: expiresAt,
    };
  }
}

export { AuthUserService };
