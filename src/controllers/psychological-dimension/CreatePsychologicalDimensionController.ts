import { Request, Response } from "express";
import { z } from "zod";

import { PsychologicalDimensionService } from "../../services/psychological-dimension/PsychologicalDimensionService";

const CreateDimensionSchema = z.object({
  acronym: z.string(),
  name: z.string(),
  selfMonitoringBlockId: z.string().cuid(),
});

class CreatePsychologicalDimensionController {
  async handle(req: Request, res: Response) {
    const data = CreateDimensionSchema.parse(req.body);

    const { acronym, name, selfMonitoringBlockId } = data;

    const createDimension = new PsychologicalDimensionService();
    const dimension = await createDimension.create({ acronym, name, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: dimension });
  }
}

export { CreatePsychologicalDimensionController };
