import { Request, Response } from "express";

import { NotificationIdSchema } from "../../../schemas/notification";
import { NotificationAdminService } from "../../../services/admin/NotificationAdminService";

class DeleteNotificationController {
  async handle(req: Request, res: Response) {
    const data = NotificationIdSchema.parse(req.params);

    const service = new NotificationAdminService();
    await service.delete(data);

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { DeleteNotificationController };
