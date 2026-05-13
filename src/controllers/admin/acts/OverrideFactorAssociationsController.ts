import { Request, Response } from "express";

import { OverrideFactorAssociationsSchema } from "../../../schemas/admin/act-analysis";
import { ActService } from "../../../services/act/ActService";
import { parseZodError } from "../../../utils/parseZodError";

class OverrideFactorAssociationsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = OverrideFactorAssociationsSchema.safeParse(req.body);
    if (!success) throw new Error(parseZodError(error));

    const service = new ActService();
    await service.overrideFactorAssociations(data.overrides);

    return res.json({ status: "SUCCESS" });
  }
}

export { OverrideFactorAssociationsController };
