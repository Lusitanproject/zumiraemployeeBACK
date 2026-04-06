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

const adminNotificationsRoutes = Router();

adminNotificationsRoutes.get("/admin", isAuthenticated, new FindAllNotificationsController().handle);
adminNotificationsRoutes.get("/admin/types", isAuthenticated, new FindAllTypesController().handle);
adminNotificationsRoutes.get("/admin/types/:id", isAuthenticated, new FindNotificationTypeController().handle);
adminNotificationsRoutes.put("/:notificationId", isAuthenticated, new UpdateNotificationController().handle);
adminNotificationsRoutes.put("/admin/types/:id", isAuthenticated, new UpdateNotificationTypeController().handle);
adminNotificationsRoutes.post("/", isAuthenticated, new CreateNotificationController().handle);
adminNotificationsRoutes.post("/admin/types", isAuthenticated, new CreateNotificationTypeController().handle);
adminNotificationsRoutes.delete("/:notificationId", isAuthenticated, new DeleteNotificationController().handle);

export { adminNotificationsRoutes };
