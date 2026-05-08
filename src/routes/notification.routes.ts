import { Router } from "express";

import { DetailNotificationController } from "../controllers/notification/DetailNotificationController";
import { ListNotificationsController } from "../controllers/notification/ListNotificationsController";
import { ReadNotificationController } from "../controllers/notification/ReadNotificationController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const notificationRouter = Router();

notificationRouter.get("/", isAuthenticated, new ListNotificationsController().handle);
notificationRouter.get("/:notificationId", isAuthenticated, new DetailNotificationController().handle);
notificationRouter.put("/:notificationId/read", isAuthenticated, new ReadNotificationController().handle);

export { notificationRouter };
