import { Request, Response } from "express";

import { FindByTrailSchema } from "../../../schemas/admin/act-chatbot";
import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

class FindByTrailController {
  async handle(req: Request, res: Response) {
    const data = FindByTrailSchema.parse(req.query);

    const service = new ActChatbotAdminService();
    const result = await service.findByTrail(data.trailId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindByTrailController };
