import { Request, Response } from "express";
import { CreatePsychologicalDimensionService } from "../../services/psychologicalDimension/CreatePsychologicalDimensionService";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { assertPermissions } from "../../utils/assertPermissions";

const CreateDimensionSchema = z.object({
    acronym: z.string(),
    name: z.string(),
});

class CreatePsychologicalDimensionController {
    async handle(req: Request, res: Response) {
        assertPermissions(req.user, "manage-dimension");

        const { success, data, error } = CreateDimensionSchema.safeParse(req.body);

        if (!success) throw new Error(parseZodError(error));

        const { acronym, name } = data;

        const createDimension = new CreatePsychologicalDimensionService();
        const dimension = await createDimension.execute({ acronym, name });

        return res.json({ status: "SUCCESS", data: dimension });
    }
}

export { CreatePsychologicalDimensionController };
