import { Request, Response } from "express";
import { CreateNotificationSchema } from "../../definitions/notification";
import { parseZodError } from "../../utils/parseZodError";
import { CreateNotificationService } from "../../services/notification/CreateNotificationService";

class CreateNotificationController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateNotificationSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const notify = new CreateNotificationService();
    const notification = await notify.execute(data);

    return res.json({ status: "SUCCESS", data: notification });
  }
}

export { CreateNotificationController };
