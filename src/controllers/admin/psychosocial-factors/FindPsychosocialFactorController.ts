import { Request, Response } from "express";

import { PsychosocialFactorIdSchema } from "../../../schemas/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";

class FindPsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const data = PsychosocialFactorIdSchema.parse(req.params);

    const service = new PsychosocialFactorAdminService();
    const factor = await service.find(data.id);

    return res.json({ status: "SUCCESS", data: factor });
  }
}

export { FindPsychosocialFactorController };
