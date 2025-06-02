import prismaClient from "../../../prisma";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  code: string;
}

class AuthUserService {
  async execute({ email, code }: AuthRequest) {
    if (!email || !code) throw new Error("Required data is missing");

    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new Error("Email is not registered");

    const storedCode = await prismaClient.authCode.findFirst({
      where: {
        userId: user.id,
        code,
      },
    });

    if (!storedCode) throw new Error("Invalid code");
    if (storedCode.expiresAt < new Date()) throw new Error("Expired code");

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
