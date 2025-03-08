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
        });

        if (!user) throw new Error("Email is not registered");

        const storedCode = await prismaClient.authCode.findFirst({
            where: {
                user_id: user.id,
            },
            orderBy: {
                expires_at: "desc",
            },
        });

        if (!storedCode) throw new Error("No code was sent");
        if (storedCode.expires_at < new Date()) throw new Error("Code is expired");
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

        console.log(`Authenticated user ${email}`);

        return {
            id: user.id,
            email: user.email,
            token: token,
        };
    }
}

export { AuthUserService };
