import { Request, Response } from "express";
import { ListNotificationsService } from "../../services/notification/ListNotificationsService";
import { ListNotificationsSchema } from "../../definitions/notification";
import { parseZodError } from "../../utils/parseZodError";

class ListNotificationsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ListNotificationsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const userId = req.user.id;

    const listNotifications = new ListNotificationsService();
    const notifications = await listNotifications.execute({ userId, ...data });

    return res.json({ status: "SUCCESS", data: notifications });
  }
}

export { ListNotificationsController };
