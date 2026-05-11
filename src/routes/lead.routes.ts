import { Request, Response, Router } from "express";
import nodemailer from "nodemailer";

const leadRouter = Router();

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Captura de lead do site
 *     description: >
 *       Endpoint de captura de leads do site institucional Zumira.
 *       Recebe os dados do formulário de contato e envia um e-mail interno para a equipe de vendas.
 *       Endpoint público — não requer autenticação.
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do contato
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do contato
 *               phone:
 *                 type: string
 *                 description: Telefone do contato
 *               company:
 *                 type: string
 *                 description: Nome da empresa do contato
 *               message:
 *                 type: string
 *                 description: Mensagem ou observação do contato
 *               plan:
 *                 type: string
 *                 description: Plano de interesse selecionado no site
 *     responses:
 *       200:
 *         description: Lead capturado e e-mail enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Name, email and plan are required.
 *       500:
 *         description: Falha ao enviar e-mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao enviar e-mail
 */
leadRouter.post("/", async (req: Request, res: Response) => {
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
    res.status(200).json({ success: true });
  } catch {
    console.log("failed to send email");
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});

export { leadRouter };
