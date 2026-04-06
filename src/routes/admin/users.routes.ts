import { Router } from "express";

import { CreateUserController } from "../../controllers/admin/users/CreateUserController";
import { DeleteUserController } from "../../controllers/admin/users/DeleteUserController";
import { FindUserByController } from "../../controllers/admin/users/FindUserByController";
import { FindUserController } from "../../controllers/admin/users/FindUserController";
import { ListAllUsersController } from "../../controllers/admin/users/ListAllUsersController";
import { ListUsersByCompanyController } from "../../controllers/admin/users/ListUsersByCompanyController";
import { UpdateUserController } from "../../controllers/admin/users/UpdateUserController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminUsersRoutes = Router();

adminUsersRoutes.post("/admin", isAuthenticated, new CreateUserController().handle);
adminUsersRoutes.get("/admin/find-by", isAuthenticated, new FindUserByController().handle);
adminUsersRoutes.put("/admin/:id", isAuthenticated, new UpdateUserController().handle);
adminUsersRoutes.delete("/:id", isAuthenticated, new DeleteUserController().handle);
adminUsersRoutes.get("/", isAuthenticated, new ListAllUsersController().handle);
adminUsersRoutes.get("/company/:companyId", isAuthenticated, new ListUsersByCompanyController().handle);
adminUsersRoutes.get("/:userId", isAuthenticated, new FindUserController().handle);

export { adminUsersRoutes };
