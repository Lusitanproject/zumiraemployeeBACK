import { Request, Response } from "express";

import { PsychosocialFactorIdSchema } from "../../../definitions/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class FindPsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = PsychosocialFactorIdSchema.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const service = new PsychosocialFactorAdminService();
    const factor = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: factor });
  }
}

export { FindPsychosocialFactorController };
