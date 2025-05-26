import { Request, Response } from "express";
import { parseZodError } from "../../utils/parseZodError";
import { ListSelfMonitoringBlockResultsSchema } from "../../definitions/selfMonitoringBlock";
import { ListSelfMonitoringBlockResultsService } from "../../services/selfMonitoringBlock/ListSelfMonitoringBlockResultsService";

class ListSelfMonitoringBlockResultsController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = ListSelfMonitoringBlockResultsSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { selfMonitoringBlockId } = data;
    const userId = req.user.id;

    const listResults = new ListSelfMonitoringBlockResultsService();
    const results = await listResults.execute({ userId, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: results });
  }
}

export { ListSelfMonitoringBlockResultsController };
