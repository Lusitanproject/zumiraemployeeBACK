import { Request, Response } from "express";
import { ListPsychologicalDimensionsService } from "../../services/psychologicalDimension/ListPsychologicalDimensionsService";

class ListPsychologicalDimensionsController {
    async handle(req: Request, res: Response) {
        const listDimensions = new ListPsychologicalDimensionsService();
        const dimensions = await listDimensions.execute();

        return res.json({ status: "SUCCESS", data: dimensions });
    }
}

export { ListPsychologicalDimensionsController };
