import { Router } from "express";

import { CreateNotificationController } from "../../controllers/admin/notifications/CreateNotificationController";
import { CreateNotificationTypeController } from "../../controllers/admin/notifications/CreateNotificationTypeController";
import { DeleteNotificationController } from "../../controllers/admin/notifications/DeleteNotificationController";
import { FindAllNotificationsController } from "../../controllers/admin/notifications/FindAllNotificationsController";
import { FindAllTypesController } from "../../controllers/admin/notifications/FindAllTypesController";
import { FindNotificationTypeController } from "../../controllers/admin/notifications/FindNotificationTypeController";
import { UpdateNotificationController } from "../../controllers/admin/notifications/UpdateNotificationController";
import { UpdateNotificationTypeController } from "../../controllers/admin/notifications/UpdateNotificationTypeController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminNotificationRouter = Router();

adminNotificationRouter.get("/", isAuthenticated, new FindAllNotificationsController().handle);
adminNotificationRouter.get("/types", isAuthenticated, new FindAllTypesController().handle);
adminNotificationRouter.get("/types/:id", isAuthenticated, new FindNotificationTypeController().handle);
adminNotificationRouter.post("/", isAuthenticated, new CreateNotificationController().handle);
adminNotificationRouter.post("/types", isAuthenticated, new CreateNotificationTypeController().handle);
adminNotificationRouter.put("/:notificationId", isAuthenticated, new UpdateNotificationController().handle);
adminNotificationRouter.put("/types/:id", isAuthenticated, new UpdateNotificationTypeController().handle);
adminNotificationRouter.delete("/:notificationId", isAuthenticated, new DeleteNotificationController().handle);

export { adminNotificationRouter };
