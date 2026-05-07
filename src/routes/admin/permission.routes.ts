import { Router } from "express";

import { FindAllPermissionsController } from "../../controllers/admin/permissions/FindAllPermissionsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminPermissionRouter = Router();

adminPermissionRouter.get("/", isAuthenticated, new FindAllPermissionsController().handle);

export { adminPermissionRouter };
