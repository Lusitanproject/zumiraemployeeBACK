import { Request, Response } from "express";

import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";

class FindAllNotificationsController {
  async handle(req: Request, res: Response) {
    const service = new NotificationAdminService();
    const notifications = await service.findAll();

    return res.json({ status: "SUCCESS", data: notifications });
  }
}

export { FindAllNotificationsController };
