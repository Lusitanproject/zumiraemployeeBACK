import { Request, Response } from "express";

import { NotificationIdSchema } from "../../schemas/notification";
import { NotificationService } from "../../services/notification/NotificationService";

class ReadNotificationController {
  async handle(req: Request, res: Response) {
    const data = NotificationIdSchema.parse(req.params);

    const userId = req.user.id;

    const service = new NotificationService();
    await service.read({ userId, ...data });

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { ReadNotificationController };
