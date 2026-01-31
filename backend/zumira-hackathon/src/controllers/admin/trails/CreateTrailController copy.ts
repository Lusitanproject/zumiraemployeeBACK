import { Request, Response } from "express";

import { CreateTrailSchema } from "../../../definitions/admin/trail";
import { TrailAdminService } from "../../../services/admin/TrailAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreateTrailController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateTrailSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new TrailAdminService();
    const result = await service.create(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateTrailController };
