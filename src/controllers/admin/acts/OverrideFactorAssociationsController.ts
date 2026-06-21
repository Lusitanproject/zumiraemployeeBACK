import { Request, Response } from "express";

import { OverrideFactorAssociationsSchema } from "../../../schemas/admin/act-analysis";
import { ActAnalysisService } from "../../../services/act/ActAnalysisService";

class OverrideFactorAssociationsController {
  async handle(req: Request, res: Response) {
    const data = OverrideFactorAssociationsSchema.parse(req.body);

    const service = new ActAnalysisService();
    await service.overrideFactorAssociations(data.overrides);

    return res.json({ status: "SUCCESS" });
  }
}

export { OverrideFactorAssociationsController };
