import { Request, Response } from "express";

import { NotificationIdSchema } from "../../schemas/notification";
import { NotificationService } from "../../services/notification/NotificationService";
import { parseZodError } from "../../utils/parseZodError";

class DetailNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = NotificationIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new NotificationService();
    const notification = await service.detail(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { DetailNotificationController };
