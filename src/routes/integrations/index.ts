import { Router } from "express";

import { integrationActsRoutes } from "./acts.routes";
import { integrationAssessmentsRoutes } from "./assessments.routes";

const integrationsRoutes = Router();

integrationsRoutes.use("/integrations/acts", integrationActsRoutes);
integrationsRoutes.use("/integrations/assessments", integrationAssessmentsRoutes);

export { integrationsRoutes };
