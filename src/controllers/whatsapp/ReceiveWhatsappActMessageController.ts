import { Request, Response } from "express";

import { WhatsappApi } from "../../external/whatsapp";
import { ActService } from "../../services/act/ActService";

class ReceiveWhatsappActMessageController {
  async handle(req: Request, res: Response) {
    const whatsapp = new WhatsappApi();
    const actService = new ActService();

    await whatsapp.receive(req.body, (msg, api) => actService.handleWhatsappMessage(msg, api));

    return res.json({ status: "SUCCESS" });
  }
}

export { ReceiveWhatsappActMessageController };
