import { Request, Response } from "express";

import { ListSelfMonitoringBlockResultsSchema } from "../../schemas/selfMonitoringBlock";
import { SelfMonitoringBlockService } from "../../services/self-monitoring-block/SelfMonitoringBlockService";

class ListSelfMonitoringBlockResultsController {
  async handle(req: Request, res: Response) {
    const data = ListSelfMonitoringBlockResultsSchema.parse(req.params);

    const { selfMonitoringBlockId } = data;
    const userId = req.user.id;

    const listResults = new SelfMonitoringBlockService();
    const results = await listResults.listResults({ userId, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { ListSelfMonitoringBlockResultsController };
