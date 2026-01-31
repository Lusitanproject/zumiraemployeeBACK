import { Request, Response } from "express";

import { UpdateNationalitySchema } from "../../../definitions/admin/nationality";
import { RequestParamsIdCUID } from "../../../definitions/common";
import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdateNationalityController {
  async handle(req: Request, res: Response) {
    const { id } = RequestParamsIdCUID.parse(req.params);
    const { success, data, error } = UpdateNationalitySchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new NationalityAdminService();
    const nationality = await service.update({ id, ...data });

    return res.json({ status: "SUCCESS", data: nationality });
  }
}

export { UpdateNationalityController };
