import { Request, Response } from "express";
import { parseZodError } from "../../../utils/parseZodError";
import { NotificationIdSchema } from "../../../definitions/notification";
import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";

class DeleteNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = NotificationIdSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new NotificationAdminService();
    await service.delete(data);

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { DeleteNotificationController };
