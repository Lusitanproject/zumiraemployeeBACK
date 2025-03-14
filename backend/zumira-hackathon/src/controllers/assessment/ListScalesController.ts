import { Request, Response } from "express";
import { ListScalesService } from "../../services/assessment/ListScalesService";

class ListScalesController {
    async handle(req: Request, res: Response) {
        const listScales = new ListScalesService();
        const scales = await listScales.execute();

        return res.json({ status: "SUCCESS", data: scales });
    }
}

export { ListScalesController };
