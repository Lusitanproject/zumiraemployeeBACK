import { Request, Response } from "express";
import { z } from "zod";

import { PsychologicalDimensionService } from "../../services/psychological-dimension/PsychologicalDimensionService";
import { parseZodError } from "../../utils/parseZodError";

const CreateDimensionSchema = z.object({
  acronym: z.string(),
  name: z.string(),
  selfMonitoringBlockId: z.string().cuid(),
});

class CreatePsychologicalDimensionController {
  async handle(req: Request, res: Response) {
const { success, data, error } = CreateDimensionSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const { acronym, name, selfMonitoringBlockId } = data;

    const createDimension = new PsychologicalDimensionService();
    const dimension = await createDimension.create({ acronym, name, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: dimension });
  }
}

export { CreatePsychologicalDimensionController };
