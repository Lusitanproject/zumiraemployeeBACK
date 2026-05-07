import { Router } from "express";

import { CreateRoleController } from "../../controllers/admin/roles/CreateRoleController";
import { DeleteRoleController } from "../../controllers/admin/roles/DeleteRoleController";
import { FindAllRolesController } from "../../controllers/admin/roles/FindAllRolesController";
import { FindRoleController } from "../../controllers/admin/roles/FindRoleController";
import { SetRolePermissionsController } from "../../controllers/admin/roles/SetRolePermissionsController";
import { UpdateRoleController } from "../../controllers/admin/roles/UpdateRoleController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminRoleRouter = Router();

adminRoleRouter.get("/", isAuthenticated, new FindAllRolesController().handle);
adminRoleRouter.get("/:id", isAuthenticated, new FindRoleController().handle);
adminRoleRouter.post("/", isAuthenticated, new CreateRoleController().handle);
adminRoleRouter.put("/:id", isAuthenticated, new UpdateRoleController().handle);
adminRoleRouter.delete("/:id", isAuthenticated, new DeleteRoleController().handle);
adminRoleRouter.put("/:id/permissions", isAuthenticated, new SetRolePermissionsController().handle);

export { adminRoleRouter };
