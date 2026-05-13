import { Request, Response } from "express";

import { ListNotificationsSchema } from "../../schemas/notification";
import { NotificationService } from "../../services/notification/NotificationService";
import { parseZodError } from "../../utils/parseZodError";

class ListNotificationsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ListNotificationsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const userId = req.user.id;

    const listNotifications = new NotificationService();
    const notifications = await listNotifications.list({ userId, ...data });

    return res.json({ status: "SUCCESS", data: notifications });
  }
}

export { ListNotificationsController };
