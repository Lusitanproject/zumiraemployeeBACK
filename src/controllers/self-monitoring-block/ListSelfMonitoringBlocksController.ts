import { Request, Response } from "express";

import { SelfMonitoringBlockService } from "../../services/self-monitoring-block/SelfMonitoringBlockService";

class ListSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const listBlocks = new SelfMonitoringBlockService();
    const blocks = await listBlocks.list();

    return res.json({ status: "SUCCESS", data: blocks });
  }
}

export { ListSelfMonitoringBlocksController };
