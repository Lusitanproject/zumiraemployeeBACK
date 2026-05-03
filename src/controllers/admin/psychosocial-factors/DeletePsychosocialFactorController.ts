import { Request, Response } from "express";

import { PsychosocialFactorIdSchema } from "../../../schemas/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class DeletePsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = PsychosocialFactorIdSchema.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const service = new PsychosocialFactorAdminService();
    await service.delete(data.id);

    return res.json({ status: "SUCCESS", data: {} });
  }
}

export { DeletePsychosocialFactorController };
