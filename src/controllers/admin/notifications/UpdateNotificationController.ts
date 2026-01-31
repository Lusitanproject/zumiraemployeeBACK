import { Request, Response } from "express";

import { UpdateNotificationSchema } from "../../../definitions/notification";
import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = UpdateNotificationSchema.safeParse({ ...req.body, ...req.params });

    if (!success) throw new Error(parseZodError(error));

    const service = new NotificationAdminService();
    const notification = await service.update(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { UpdateNotificationController };
