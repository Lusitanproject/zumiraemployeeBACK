import { Router } from "express";

import { adminActsRoutes } from "./acts.routes";
import { adminAssessmentsRoutes } from "./assessments.routes";
import { adminCompaniesRoutes } from "./companies.routes";
import { adminDimensionsRoutes } from "./dimensions.routes";
import { adminNationalitiesRoutes } from "./nationalities.routes";
import { adminNotificationsRoutes } from "./notifications.routes";
import { adminRolesRoutes } from "./roles.routes";
import { adminSelfMonitoringRoutes } from "./self-monitoring.routes";
import { adminTrailsRoutes } from "./trails.routes";
import { adminUsersRoutes } from "./users.routes";

const adminRoutes = Router();

adminRoutes.use("/acts", adminActsRoutes);
adminRoutes.use("/assessments", adminAssessmentsRoutes);
adminRoutes.use("/companies", adminCompaniesRoutes);
adminRoutes.use("/dimensions", adminDimensionsRoutes);
adminRoutes.use("/nationalities", adminNationalitiesRoutes);
adminRoutes.use("/notifications", adminNotificationsRoutes);
adminRoutes.use("/roles", adminRolesRoutes);
adminRoutes.use("/self-monitoring", adminSelfMonitoringRoutes);
adminRoutes.use("/trails", adminTrailsRoutes);
adminRoutes.use("/users", adminUsersRoutes);

export { adminRoutes };
