import { Request, Response } from "express";
import { FindByTrailSchema } from "../../../definitions/admin/act-chatbot";
import { parseZodError } from "../../../utils/parseZodError";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";

class FindByTrailController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = FindByTrailSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new ActChatbotAdminService();
    const result = await service.findByTrail(data.trailId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindByTrailController };
