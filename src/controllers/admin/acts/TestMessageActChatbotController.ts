import { Request, Response } from "express";

import { TestMessageActChatbotSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

class TestMessageActChatbotController {
  async handle(req: Request, res: Response) {
    const { actChatbotId } = req.params;
    const { content, messages } = TestMessageActChatbotSchema.parse(req.body);

    const service = new ActChatbotAdminService();
    const result = await service.testMessage(actChatbotId, content, messages);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { TestMessageActChatbotController };
