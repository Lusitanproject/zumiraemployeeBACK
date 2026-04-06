import { Router } from "express";

import { FindAllRolesController } from "../../controllers/admin/roles/FindAllRolesController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminRolesRoutes = Router();

adminRolesRoutes.get("/", isAuthenticated, new FindAllRolesController().handle);

export { adminRolesRoutes };
