import { Request, Response } from "express";
import { NotificationIdSchema } from "../../definitions/notification";
import { parseZodError } from "../../utils/parseZodError";
import { DeleteNotificationService } from "../../services/notification/DeleteNotificationService";

class DeleteNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = NotificationIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new DeleteNotificationService();
    await service.execute(data);

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { DeleteNotificationController };
