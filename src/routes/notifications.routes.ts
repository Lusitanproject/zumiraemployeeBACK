import { Router } from "express";

import { DetailNotificationController } from "../controllers/notification/DetailNotificationController";
import { ListNotificationsController } from "../controllers/notification/ListNotificationsController";
import { ReadNotificationController } from "../controllers/notification/ReadNotificationController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const notificationsRoutes = Router();

notificationsRoutes.get("/", isAuthenticated, new ListNotificationsController().handle);
notificationsRoutes.get("/:notificationId", isAuthenticated, new DetailNotificationController().handle);
notificationsRoutes.put("/:notificationId/read", isAuthenticated, new ReadNotificationController().handle);

export { notificationsRoutes };
