import prismaClient from "../../../prisma";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";

async function sendEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Código de login",
            text: `Seu código é ${code}`,
        });
    } catch (err: any) {
        console.log(err.message);
        throw new Error("Error sending email");
    }
}

class SendCodeService {
    async execute(email: string) {
        if (!email) throw new Error("Email is missing");

        const storedEmail = await prismaClient.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!storedEmail) throw new Error("Email is not registered");

        const code = randomInt(100000, 999999).toString();

        const now = new Date().getTime();
        const expiresAt = new Date(now + 5 * 60 * 1000); // Expiração em 5 minutos

        await sendEmail(email, code);

        await prismaClient.authCode.create({
            data: {
                userId: storedEmail.id,
                code: code,
                expiresAt: expiresAt,
            },
        });

        console.log(`Sent code ${code} to ${email}`);

        return {};
    }
}

export { SendCodeService };
