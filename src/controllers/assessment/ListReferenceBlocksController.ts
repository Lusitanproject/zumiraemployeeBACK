import { Request, Response } from "express";

import { SelfMonitoringBlockService } from "../../services/self-monitoring-block/SelfMonitoringBlockService";

class ListReferenceBlocksController {
  async handle(req: Request, res: Response) {
    const service = new SelfMonitoringBlockService();
    const result = await service.listAll();

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { ListReferenceBlocksController };
