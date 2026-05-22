import { Request, Response } from "express";

import { CreatePsychosocialFactorSchema } from "../../../schemas/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";

class CreatePsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const data = CreatePsychosocialFactorSchema.parse(req.body);

    const service = new PsychosocialFactorAdminService();
    const factor = await service.create(data);

    return res.json({ status: "SUCCESS", data: factor });
  }
}

export { CreatePsychosocialFactorController };
