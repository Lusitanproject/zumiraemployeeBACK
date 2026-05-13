import { Request, Response } from "express";

import { PsychosocialFactorService } from "../../services/psychosocial-factor/PsychosocialFactorService";

class ListPsychosocialFactorsController {
  async handle(req: Request, res: Response) {
    const service = new PsychosocialFactorService();
    const factors = await service.findAll();

    return res.json({ status: "SUCCESS", data: factors });
  }
}

export { ListPsychosocialFactorsController };
