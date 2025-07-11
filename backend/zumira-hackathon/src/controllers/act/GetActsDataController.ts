import { Request, Response } from "express";

import { GetActsDataService } from "../../services/act/GetActsDataService";

class GetActsDataController {
  async handle(req: Request, res: Response) {
    const service = new GetActsDataService();
    const result = await service.execute(req.user.id);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetActsDataController };
