import { Request, Response } from "express";
import { z } from "zod";

import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";

const RequestParam = z.object({
  id: z.string().cuid(),
});

class FindNotificationTypeController {
  async handle(req: Request, res: Response) {
    const data = RequestParam.parse(req.params);

    const service = new NotificationTypeAdminService();
    const notification = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { FindNotificationTypeController };
