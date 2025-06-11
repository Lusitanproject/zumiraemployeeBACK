import { Request, Response } from "express";

import { CreateNotificationSchema } from "../../../definitions/notification";
import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreateNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateNotificationSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const notify = new NotificationAdminService();
    const notification = await notify.create(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { CreateNotificationController };
