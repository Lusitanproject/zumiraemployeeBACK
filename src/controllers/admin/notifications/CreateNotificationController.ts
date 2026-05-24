import { Request, Response } from "express";

import { CreateNotificationSchema } from "../../../schemas/notification";
import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";

class CreateNotificationController {
  async handle(req: Request, res: Response) {
    const data = CreateNotificationSchema.parse(req.body);

    const notify = new NotificationAdminService();
    const notification = await notify.create(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { CreateNotificationController };
