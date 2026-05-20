import { Request, Response } from "express";

import { NotificationIdSchema } from "../../schemas/notification";
import { NotificationService } from "../../services/notification/NotificationService";

class DetailNotificationController {
  async handle(req: Request, res: Response) {
    const data = NotificationIdSchema.parse(req.params);

    const service = new NotificationService();
    const notification = await service.detail(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { DetailNotificationController };
