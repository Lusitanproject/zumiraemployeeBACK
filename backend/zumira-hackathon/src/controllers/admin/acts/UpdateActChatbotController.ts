import { Request, Response } from "express";

import { UpdateActChatbotSchema } from "../../../definitions/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateActChatbotController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = UpdateActChatbotSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActChatbotAdminService();
    const result = await service.update(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateActChatbotController };
