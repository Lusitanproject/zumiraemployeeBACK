import { Request, Response } from "express";

import { UpdateManyActChatbotsSchema } from "../../../definitions/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateManyActChatbotsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = UpdateManyActChatbotsSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActChatbotAdminService();
    const result = await service.updateMany(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateManyActChatbotsController };
