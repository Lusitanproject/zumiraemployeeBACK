import { Request, Response } from "express";

import { RequestParamsIdCUID } from "../../../definitions/common";
import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class FindNationalityController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParamsIdCUID.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const service = new NationalityAdminService();
    const nationality = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: nationality });
  }
}

export { FindNationalityController };
