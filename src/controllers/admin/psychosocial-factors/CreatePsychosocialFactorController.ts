import { Request, Response } from "express";

import { CreatePsychosocialFactorSchema } from "../../../definitions/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class CreatePsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreatePsychosocialFactorSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new PsychosocialFactorAdminService();
    const factor = await service.create(data);

    return res.json({ status: "SUCCESS", data: factor });
  }
}

export { CreatePsychosocialFactorController };
