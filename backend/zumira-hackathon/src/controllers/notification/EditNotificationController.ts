import { Request, Response } from "express";
import { EditNotificationSchema } from "../../definitions/notification";
import { parseZodError } from "../../utils/parseZodError";
import { EditNotificationService } from "../../services/notification/EditNotificationService";

class EditNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = EditNotificationSchema.safeParse({ ...req.body, ...req.params });

    if (!success) throw new Error(parseZodError(error));

    const service = new EditNotificationService();
    const notification = await service.execute(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { EditNotificationController };
