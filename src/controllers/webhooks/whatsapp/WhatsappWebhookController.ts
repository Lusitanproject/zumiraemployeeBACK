import { Request, Response } from "express";

import {
  getPhoneNumberIdFromPayload,
  getWebhookFieldFromPayload,
  WhatsappApi,
  WhatsappWebhookField,
} from "../../../external/whatsapp";
import { ActService } from "../../../services/act/ActService";

class WhatsappWebhookController {
  async handle(req: Request, res: Response) {
    const field = getWebhookFieldFromPayload(req.body);

    console.log(`[WhatsApp] webhook event received — field: ${field}`);

    if (field === WhatsappWebhookField.MESSAGES) {
      const phoneNumberId = getPhoneNumberIdFromPayload(req.body);
      if (!phoneNumberId) {
        console.log("[WhatsApp] MESSAGES event without phone_number_id in metadata, ignoring");
        return res.json({ status: "SUCCESS" });
      }
      const whatsapp = new WhatsappApi(phoneNumberId);
      const actService = new ActService();
      await whatsapp.receive(req.body, (msg, api) => actService.handleWhatsappMessage(msg, api));
    } else {
      console.log(`[WhatsApp] unhandled field "${field}", ignoring`);
    }

    return res.json({ status: "SUCCESS" });
  }
}

export { WhatsappWebhookController };
