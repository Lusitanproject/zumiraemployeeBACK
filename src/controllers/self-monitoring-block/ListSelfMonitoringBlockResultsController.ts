import { Request, Response } from "express";

import { ListSelfMonitoringBlockResultsSchema } from "../../schemas/selfMonitoringBlock";
import { SelfMonitoringBlockService } from "../../services/self-monitoring-block/SelfMonitoringBlockService";
import { parseZodError } from "../../utils/parseZodError";

class ListSelfMonitoringBlockResultsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ListSelfMonitoringBlockResultsSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { selfMonitoringBlockId } = data;
    const userId = req.user.id;

    const listResults = new SelfMonitoringBlockService();
    const results = await listResults.listResults({ userId, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { ListSelfMonitoringBlockResultsController };
