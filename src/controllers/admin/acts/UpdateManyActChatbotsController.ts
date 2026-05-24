import { Request, Response } from "express";

import { UpdateManyActChatbotsSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

class UpdateManyActChatbotsController {
  async handle(req: Request, res: Response) {
    const data = UpdateManyActChatbotsSchema.parse(req.body);

    const service = new ActChatbotAdminService();
    const result = await service.updateMany(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateManyActChatbotsController };
