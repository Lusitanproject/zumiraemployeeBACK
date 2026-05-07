import { Router } from "express";

import { ListSelfMonitoringBlockResultsController } from "../controllers/self-monitoring-block/ListSelfMonitoringBlockResultsController";
import { ListSelfMonitoringBlocksController } from "../controllers/self-monitoring-block/ListSelfMonitoringBlocksController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const selfMonitoringRouter = Router();

selfMonitoringRouter.get("/", isAuthenticated, new ListSelfMonitoringBlocksController().handle);
selfMonitoringRouter.get(
  "/results/:selfMonitoringBlockId",
  isAuthenticated,
  new ListSelfMonitoringBlockResultsController().handle,
);

export { selfMonitoringRouter };
