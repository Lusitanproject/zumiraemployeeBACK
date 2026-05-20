import { Request, Response } from "express";

class VerifyWhatsappWebhookController {
  handle(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];

    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log("[WhatsApp] webhook verified successfully");
      return res.status(200).send(challenge);
    }

    console.warn("[WhatsApp] webhook verification failed — invalid token");
    return res.sendStatus(403);
  }
}

export { VerifyWhatsappWebhookController };
