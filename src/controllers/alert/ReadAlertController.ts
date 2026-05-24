import { Request, Response } from "express";

import { ReadAlertSchema } from "../../schemas/alert";
import { AlertService } from "../../services/alert/AlertService";

class ReadAlertController {
  async handle(req: Request, res: Response) {
    const data = ReadAlertSchema.parse(req.params);

    const service = new AlertService();
    const result = await service.read(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ReadAlertController };
