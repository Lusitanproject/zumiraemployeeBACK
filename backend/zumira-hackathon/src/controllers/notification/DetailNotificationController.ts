import { Request, Response } from "express";

import { NotificationIdSchema } from "../../definitions/notification";
import { DetailNotificationService } from "../../services/notification/DetailNotificationService";
import { parseZodError } from "../../utils/parseZodError";

class DetailNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = NotificationIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new DetailNotificationService();
    const notification = await service.execute(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { DetailNotificationController };
