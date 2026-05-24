import { Request, Response } from "express";

import { UpdateNotificationTypeSchema } from "../../../schemas/admin/notification";
import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";

class UpdateNotificationTypeController {
  async handle(req: Request, res: Response) {
    const data = UpdateNotificationTypeSchema.parse({ ...req.body, ...req.params });

    const service = new NotificationTypeAdminService();
    const notification = await service.update(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { UpdateNotificationTypeController };
