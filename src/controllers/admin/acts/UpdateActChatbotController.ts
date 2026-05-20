import { Request, Response } from "express";

import { UpdateActChatbotSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

class UpdateActChatbotController {
  async handle(req: Request, res: Response) {
    const data = UpdateActChatbotSchema.parse(req.body);

    const service = new ActChatbotAdminService();
    const result = await service.update(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateActChatbotController };
