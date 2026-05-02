import { Request, Response } from "express";

import {
  PsychosocialFactorIdSchema,
  UpdatePsychosocialFactorSchema,
} from "../../../definitions/admin/psychosocial-factor";
import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";
import { parseZodError } from "../../../utils/parseZodError";

class UpdatePsychosocialFactorController {
  async handle(req: Request, res: Response) {
    const { success: idSuccess, data: idData, error: idError } = PsychosocialFactorIdSchema.safeParse(req.params);
    if (!idSuccess) throw new Error(parseZodError(idError));

    const { success, data, error } = UpdatePsychosocialFactorSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new PsychosocialFactorAdminService();
    const factor = await service.update({ id: idData.id, ...data });

    return res.json({ status: "SUCCESS", data: factor });
  }
}

export { UpdatePsychosocialFactorController };
