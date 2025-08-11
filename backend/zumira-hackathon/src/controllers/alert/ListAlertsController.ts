import { Request, Response } from "express";

import { ListAlertsService } from "../../services/alert/ListAlertsService";
import { ListAlertsSchema } from "../../definitions/alert";
import { parseZodError } from "../../utils/parseZodError";

class ListAlertsController {
  async handle(req: Request, res: Response) {
    const { error, data, success } = ListAlertsSchema.safeParse(req.query);

    if (!success) throw new Error(parseZodError(error));

    const service = new ListAlertsService();
    const result = await service.execute({ userId: req.user.id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListAlertsController };
