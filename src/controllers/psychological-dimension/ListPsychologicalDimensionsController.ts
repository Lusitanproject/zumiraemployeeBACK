import { Request, Response } from "express";

import { PsychologicalDimensionService } from "../../services/psychological-dimension/PsychologicalDimensionService";

class ListPsychologicalDimensionsController {
  async handle(req: Request, res: Response) {
    const listDimensions = new PsychologicalDimensionService();
    const dimensions = await listDimensions.list();

    return res.json({ status: "SUCCESS", data: { dimensions } });
  }
}

export { ListPsychologicalDimensionsController };
