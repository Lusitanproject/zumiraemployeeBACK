import { Request, Response, Router } from "express";
import nodemailer from "nodemailer";

const leadsRoutes = Router();

leadsRoutes.post("/", async (req: Request, res: Response) => {
  const { name, email, phone, company, message, plan } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name, email and plan are required." });
  }

  const leadInfo =
    "Este e-mail foi gerado a partir da captura de leads do site Zumira.\n" +
    `Nome: ${name}\n` +
    `Email: ${email}\n` +
    `Telefone: ${phone || "Não informado"}\n` +
    `Empresa: ${company || "Não informado"}\n` +
    `Plano: ${plan || "Nenhum"}\n` +
    `Mensagem: ${message || "Não informado"}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: {
        name: "Zumira",
        address: process.env.EMAIL_USER!,
      },
      to: process.env.LEAD_CAPTURE_EMAIL ?? "zumirajobs@gmail.com",
      subject: "Captura de leads zumira",
      text: leadInfo,
    });

    console.log("sent email");

    return res.status(200).json({ success: true });
  } catch {
    console.log("failed to send email");

    return res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});

export { leadsRoutes };
