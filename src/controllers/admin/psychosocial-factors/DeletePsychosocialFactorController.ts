import { Request, Response } from "express";

import { PsychosocialFactorIdSchema } from "../../../schemas/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";

class DeletePsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const data = PsychosocialFactorIdSchema.parse(req.params);

    const service = new PsychosocialFactorAdminService();
    await service.delete(data.id);

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { DeletePsychosocialFactorController };
