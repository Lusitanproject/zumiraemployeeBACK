import { Request, Response } from "express";

import { NotificationIdSchema } from "../../definitions/notification";
import { ReadNotificationService } from "../../services/notification/ReadNotificationService";
import { parseZodError } from "../../utils/parseZodError";

class ReadNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = NotificationIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const userId = req.user.id;

    const service = new ReadNotificationService();
    await service.execute({ userId, ...data });

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { ReadNotificationController };
