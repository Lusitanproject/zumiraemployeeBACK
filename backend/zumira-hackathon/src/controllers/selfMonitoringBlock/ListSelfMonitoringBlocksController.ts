import { Request, Response } from "express";
import { ListSelfMonitoringBlocksService } from "../../services/selfMonitoringBlock/ListSelfMonitoringBlocksService";

class ListSelfMonitoringBlocksController {
  async handle(req: Request, res: Response) {
    const listBlocks = new ListSelfMonitoringBlocksService();
    const blocks = await listBlocks.execute();

    return res.json({ status: "SUCCESS", data: blocks });
  }
}

export { ListSelfMonitoringBlocksController };
