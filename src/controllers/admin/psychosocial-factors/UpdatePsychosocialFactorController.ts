import { Request, Response } from "express";

import { PsychosocialFactorIdSchema, UpdatePsychosocialFactorSchema } from "../../../schemas/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";

class UpdatePsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const idData = PsychosocialFactorIdSchema.parse(req.params);

    const data = UpdatePsychosocialFactorSchema.parse(req.body);

    const service = new PsychosocialFactorAdminService();
    const factor = await service.update({ id: idData.id, ...data });

    return res.json({ status: "SUCCESS", data: factor });
  }
}

export { UpdatePsychosocialFactorController };
