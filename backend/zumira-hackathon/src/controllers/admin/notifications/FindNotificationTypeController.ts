import { Request, Response } from "express";
import { parseZodError } from "../../../utils/parseZodError";
import { z } from "zod";
import { NotificationTypeAdminService } from "../../../services/admin/NotificationTypeAdminService";

const RequestParam = z.object({
  id: z.string().cuid(),
});

class FindNotificationTypeController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new NotificationTypeAdminService();
    const notification = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { FindNotificationTypeController };
