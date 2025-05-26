import { Request, Response } from "express";
import { parseZodError } from "../../../utils/parseZodError";
import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";
import { CreateNotificationTypeSchema } from "../../../definitions/admin/notification";

class CreateNotificationTypeController {
  async handle(req: Request, res: Response) {
    const { data, success, error } = CreateNotificationTypeSchema.safeParse({ ...req.body });

    if (!success) throw new Error(parseZodError(error));

    const service = new NotificationTypeAdminService();
    const notification = await service.create(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { CreateNotificationTypeController };
