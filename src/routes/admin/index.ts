import { Router } from "express";

import { adminActRouter } from "./act.routes";
import { adminAssessmentRouter } from "./assessment.routes";
import { adminCompanyRouter } from "./company.routes";
import { adminDimensionRouter } from "./dimension.routes";
import { adminNationalityRouter } from "./nationality.routes";
import { adminNotificationRouter } from "./notification.routes";
import { adminPermissionRouter } from "./permission.routes";
import { adminPsychosocialFactorRouter } from "./psychosocial-factor.routes";
import { adminRoleRouter } from "./role.routes";
import { adminSelfMonitoringRouter } from "./self-monitoring.routes";
import { adminSystemConfigRouter } from "./system-config.routes";
import { adminTrailRouter } from "./trail.routes";
import { adminUserRouter } from "./user.routes";

const adminRouter = Router();

adminRouter.use("/users", adminUserRouter);
adminRouter.use("/roles", adminRoleRouter);
adminRouter.use("/permissions", adminPermissionRouter);
adminRouter.use("/dimensions", adminDimensionRouter);
adminRouter.use("/assessments", adminAssessmentRouter);
adminRouter.use("/self-monitoring", adminSelfMonitoringRouter);
adminRouter.use("/psychosocial-factors", adminPsychosocialFactorRouter);
adminRouter.use("/companies", adminCompanyRouter);
adminRouter.use("/nationalities", adminNationalityRouter);
adminRouter.use("/notifications", adminNotificationRouter);
adminRouter.use("/acts", adminActRouter);
adminRouter.use("/trails", adminTrailRouter);
adminRouter.use("/system-config", adminSystemConfigRouter);

export { adminRouter };
