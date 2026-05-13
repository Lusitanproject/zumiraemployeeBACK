import { Request, Response } from "express";

import { NotificationIdSchema } from "../../schemas/notification";
import { NotificationService } from "../../services/notification/NotificationService";
import { parseZodError } from "../../utils/parseZodError";

class ReadNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = NotificationIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const userId = req.user.id;

    const service = new NotificationService();
    await service.read({ userId, ...data });

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { ReadNotificationController };
