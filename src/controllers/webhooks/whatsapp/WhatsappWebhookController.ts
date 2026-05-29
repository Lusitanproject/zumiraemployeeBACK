import { Request, Response } from "express";

import { WhatsappApi, WhatsappWebhookField } from "../../../external/whatsapp";
import { ActService } from "../../../services/act/ActService";

class WhatsappWebhookController {
  async handle(req: Request, res: Response) {
    const whatsapp = new WhatsappApi();

    // if (!whatsapp.matchesPhoneNumberId(req.body, process.env.PHONE_NUMBER_ID!)) {
    //   console.log("[WhatsApp] message is not for this phone number, ignoring");
    //   return res.json({ status: "SUCCESS" });
    // }

    const field = whatsapp.getField(req.body);

    console.log(`[WhatsApp] webhook event received — field: ${field}`);

    if (field === WhatsappWebhookField.MESSAGES) {
      const actService = new ActService();
      await whatsapp.receive(req.body, (msg, api) => actService.handleWhatsappMessage(msg, api));
    } else {
      console.log(`[WhatsApp] unhandled field "${field}", ignoring`);
    }

    return res.json({ status: "SUCCESS" });
  }
}

export { WhatsappWebhookController };
