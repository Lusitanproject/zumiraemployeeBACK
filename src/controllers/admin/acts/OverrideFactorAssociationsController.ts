import { Request, Response } from "express";

import { OverrideFactorAssociationsSchema } from "../../../schemas/admin/act-analysis";
import { ActService } from "../../../services/act/ActService";

class OverrideFactorAssociationsController {
  async handle(req: Request, res: Response) {
    const data = OverrideFactorAssociationsSchema.parse(req.body);

    const service = new ActService();
    await service.overrideFactorAssociations(data.overrides);

    return res.json({ status: "SUCCESS" });
  }
}

export { OverrideFactorAssociationsController };
