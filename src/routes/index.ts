import { Router } from "express";

import { actRouter } from "./act.routes";
import { assessmentRouter } from "./assessment.routes";
import { authRouter } from "./auth.routes";
import { companyRouter } from "./company.routes";
import { integrationRouter } from "./integration.routes";
import { leadRouter } from "./lead.routes";
import { nationalityRouter } from "./nationality.routes";
import { notificationRouter } from "./notification.routes";
import { psychosocialFactorRouter } from "./psychosocial-factor.routes";
import { selfMonitoringRouter } from "./self-monitoring.routes";
import { userRouter } from "./user.routes";
import { adminRouter } from "./admin";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/assessments", assessmentRouter);
router.use("/acts", actRouter);
router.use("/self-monitoring", selfMonitoringRouter);
router.use("/notifications", notificationRouter);
router.use("/nationalities", nationalityRouter);
router.use("/psychosocial-factors", psychosocialFactorRouter);
router.use("/companies", companyRouter);
router.use("/integrations", integrationRouter);
router.use("/leads", leadRouter);
router.use("/admin", adminRouter);

export { router };
