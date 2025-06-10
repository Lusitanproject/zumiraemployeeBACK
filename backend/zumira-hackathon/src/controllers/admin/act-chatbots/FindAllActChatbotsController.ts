import { Request, Response } from "express";
import { ActChatbotAdminService } from "../../../services/admin/ActChatbotAdminService";

class FindAllActChatbotsController {
  async handle(req: Request, res: Response) {
    const service = new ActChatbotAdminService();
    const result = await service.findAll();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { FindAllActChatbotsController };
