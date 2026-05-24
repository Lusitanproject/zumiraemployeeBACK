import { Request, Response } from "express";

import { MessageActChatbotSchema } from "../../schemas/actChatbot";
import { ActService } from "../../services/act/ActService";

class MessageActChatbotController {
  async handle(req: Request, res: Response) {
    const data = MessageActChatbotSchema.parse(req.body);

    const service = new ActService();
    const result = await service.message({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { MessageActChatbotController };
