import { Request, Response } from "express";

import { ListAlertsSchema } from "../../schemas/alert";
import { AlertService } from "../../services/alert/AlertService";
import { parseZodError } from "../../utils/parseZodError";

class ListAlertsController {
  async handle(req: Request, res: Response) {
    const { error, data, success } = ListAlertsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new AlertService();
    const result = await service.list({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListAlertsController };
