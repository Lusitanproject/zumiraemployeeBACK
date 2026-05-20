import { Request, Response } from "express";

import { UpdateNotificationSchema } from "../../../schemas/notification";
import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";

class UpdateNotificationController {
  async handle(req: Request, res: Response) {
    const data = UpdateNotificationSchema.parse({ ...req.body, ...req.params });

    const service = new NotificationAdminService();
    const notification = await service.update(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { UpdateNotificationController };
