import { Request, Response } from "express";

import { ReadAlertSchema } from "../../definitions/alert";
import { ReadAlertService } from "../../services/alert/ReadAlertService";
import { parseZodError } from "../../utils/parseZodError";

class ReadAlertController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ReadAlertSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const service = new ReadAlertService();
    const result = await service.execute(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ReadAlertController };
