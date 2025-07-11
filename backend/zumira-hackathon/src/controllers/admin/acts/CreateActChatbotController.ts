import { Request, Response } from "express";

import { CreateActChatbotSchema } from "../../../definitions/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreateActChatbotController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateActChatbotSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActChatbotAdminService();
    const result = await service.create(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateActChatbotController };
