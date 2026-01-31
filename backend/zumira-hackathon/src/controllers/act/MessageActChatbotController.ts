import { Request, Response } from "express";

import { MessageActChatbotSchema } from "../../definitions/actChatbot";
import { MessageActChatbotService } from "../../services/act/MessageActChatbotService";
import { parseZodError } from "../../utils/parseZodError";

class MessageActChatbotController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = MessageActChatbotSchema.safeParse(req.body);

    if (!success) throw Error(parseZodError(error));

    const service = new MessageActChatbotService();
    const result = await service.execute({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { MessageActChatbotController };
