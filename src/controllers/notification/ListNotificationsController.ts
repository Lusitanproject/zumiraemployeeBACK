import { Request, Response } from "express";

import { ListNotificationsSchema } from "../../schemas/notification";
import { NotificationService } from "../../services/notification/NotificationService";

class ListNotificationsController {
  async handle(req: Request, res: Response) {
    const data = ListNotificationsSchema.parse(req.query);

    const userId = req.user.id;

    const listNotifications = new NotificationService();
    const notifications = await listNotifications.list({ userId, ...data });

    return res.json({ status: "SUCCESS", data: notifications });
  }
}

export { ListNotificationsController };
