import { Request, Response } from "express";
import { ReorderActChatbotsSchema } from "../../../definitions/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class ReorderActChatbotsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ReorderActChatbotsSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActChatbotAdminService();
    const result = await service.reorder(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ReorderActChatbotsController };
