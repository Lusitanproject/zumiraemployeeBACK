import { Request, Response } from "express";

import { PsychosocialFactorAdminService } from "../../../services/admin/PsychosocialFactorAdminService";

class FindAllPsychosocialFactorsController {
  async handle(req: Request, res: Response) {
    const service = new PsychosocialFactorAdminService();
    const factors = await service.findAll();

    return res.json({ status: "SUCCESS", data: factors });
  }
}

export { FindAllPsychosocialFactorsController };
