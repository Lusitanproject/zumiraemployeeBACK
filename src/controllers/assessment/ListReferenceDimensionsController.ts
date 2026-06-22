import { Request, Response } from "express";

import { ListReferenceDimensionsQuerySchema } from "../../schemas/assessment";
import { DimensionService } from "../../services/dimension/DimensionService";

class ListReferenceDimensionsController {
  async handle(req: Request, res: Response) {
    const { assessmentId } = ListReferenceDimensionsQuerySchema.parse(req.query);

    const service = new DimensionService();
    const result = await service.listByAssessment(assessmentId);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListReferenceDimensionsController };
