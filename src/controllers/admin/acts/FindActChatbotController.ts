import { Request, Response } from "express";

import { ActChatbotAdminService } from "../../../services/admin/ActAdminService";

class FindActChatbotController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const service = new ActChatbotAdminService();
    const result = await service.findById(id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindActChatbotController };
