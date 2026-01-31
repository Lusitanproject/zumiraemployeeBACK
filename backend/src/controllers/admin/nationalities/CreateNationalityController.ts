import { Request, Response } from "express";

import { CreateNationalitySchema } from "../../../definitions/admin/nationality";
import { NationalityAdminService } from "../../../services/admin/NationalityAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreateNationalityController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateNationalitySchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new NationalityAdminService();
    const nationality = await service.create(data);

    return res.json({ status: "SUCCESS", data: nationality });
  }
}

export { CreateNationalityController };
