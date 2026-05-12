import { Request, Response } from "express";

import { ReadAlertSchema } from "../../schemas/alert";
import { AlertService } from "../../services/alert/AlertService";
import { parseZodError } from "../../utils/parseZodError";

class ReadAlertController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ReadAlertSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new AlertService();
    const result = await service.read(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ReadAlertController };
