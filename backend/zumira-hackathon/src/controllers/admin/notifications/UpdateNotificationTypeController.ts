import { Request, Response } from "express";

import { UpdateNotificationTypeSchema } from "../../../definitions/admin/notification";
import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateNotificationTypeController {
  async handle(req: Request, res: Response) {
    const { data, success, error } = UpdateNotificationTypeSchema.safeParse({ ...req.body, ...req.params });

    if (!success) throw new Error(parseZodError(error));

    const service = new NotificationTypeAdminService();
    const notification = await service.update(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { UpdateNotificationTypeController };
