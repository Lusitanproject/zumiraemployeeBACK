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
            },
            orderBy: {
                expiresAt: "desc",
            },
        });

        if (!storedCode) throw new Error("No code was sent");
        if (storedCode.expiresAt < new Date()) throw new Error("Code is expired");
        if (storedCode.code !== code) throw new Error("Incorrect code");

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

        console.log(`Authenticated user ${email}`);

        return {
            name: user.name,
            role: user.role.slug,
            token: token,
            expiresAt: expiresAt,
        };
    }
}

export { AuthUserService };
