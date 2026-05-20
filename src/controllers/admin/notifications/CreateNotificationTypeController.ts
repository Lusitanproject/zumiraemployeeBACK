import { Request, Response } from "express";

import { CreateNotificationTypeSchema } from "../../../schemas/admin/notification";
import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";

class CreateNotificationTypeController {
  async handle(req: Request, res: Response) {
    const data = CreateNotificationTypeSchema.parse({ ...req.body });

    const service = new NotificationTypeAdminService();
    const notification = await service.create(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { CreateNotificationTypeController };
