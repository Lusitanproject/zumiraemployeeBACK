import { Request, Response } from "express";

import { TrailAdminService } from "../../../services/admin/TrailAdminService";
import { RequestParamsIdCUID } from "../../../definitions/common";
import { UpdateTrailSchema } from "../../../definitions/admin/trail";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateTrailController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const { data, error, success } = UpdateTrailSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new TrailAdminService();
    const result = await service.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { UpdateTrailController };
