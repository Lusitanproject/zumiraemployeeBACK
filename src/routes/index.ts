import { Router } from "express";

import { actsRoutes } from "./acts.routes";
import { adminRoutes } from "./admin";
import { assessmentsRoutes } from "./assessments.routes";
import { authRoutes } from "./auth.routes";
import { companiesRoutes } from "./companies.routes";
import { integrationsRoutes } from "./integrations";
import { leadsRoutes } from "./leads.routes";
import { nationalitiesRoutes } from "./nationalities.routes";
import { notificationsRoutes } from "./notifications.routes";
import { selfMonitoringRoutes } from "./self-monitoring.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/assessments", assessmentsRoutes);
router.use("/self-monitoring", selfMonitoringRoutes);
router.use("/companies", companiesRoutes);
router.use("/nationalities", nationalitiesRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/acts", actsRoutes);

router.use(adminRoutes);
router.use(integrationsRoutes);

router.use("/leads", leadsRoutes);

export { router };
