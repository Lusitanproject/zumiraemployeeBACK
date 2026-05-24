import { Request, Response } from "express";

import { CreateActChatbotSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

class CreateActChatbotController {
  async handle(req: Request, res: Response) {
    const data = CreateActChatbotSchema.parse(req.body);

    const service = new ActChatbotAdminService();
    const result = await service.create(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActChatbotController };
