"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = void 0;
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const leadsRoutes = (0, express_1.Router)();
exports.leadsRoutes = leadsRoutes;
leadsRoutes.post("/", async (req, res) => {
    var _a;
    const { name, email, phone, company, message, plan } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name, email and plan are required." });
    }
    const leadInfo = "Este e-mail foi gerado a partir da captura de leads do site Zumira.\n" +
        `Nome: ${name}\n` +
        `Email: ${email}\n` +
        `Telefone: ${phone || "Não informado"}\n` +
        `Empresa: ${company || "Não informado"}\n` +
        `Plano: ${plan || "Nenhum"}\n` +
        `Mensagem: ${message || "Não informado"}`;
    const transporter = nodemailer_1.default.createTransport({
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
                address: process.env.EMAIL_USER,
            },
            to: (_a = process.env.LEAD_CAPTURE_EMAIL) !== null && _a !== void 0 ? _a : "zumirajobs@gmail.com",
            subject: "Captura de leads zumira",
            text: leadInfo,
        });
        console.log("sent email");
        return res.status(200).json({ success: true });
    }
    catch {
        console.log("failed to send email");
        return res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
});
