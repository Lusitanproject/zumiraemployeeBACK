import { Request, Response } from "express";
import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";

class FindAllTypesController {
  async handle(req: Request, res: Response) {
    const service = new NotificationTypeAdminService();
    const types = await service.findAll();

    return res.json({ status: "SUCCESS", data: types });
  }
}

export { FindAllTypesController };
