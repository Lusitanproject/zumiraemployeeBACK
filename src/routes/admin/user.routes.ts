import { Router } from "express";

import { CreateManyUsersController } from "../../controllers/admin/users/CreateManyUsersController";
import { CreateUserController } from "../../controllers/admin/users/CreateUserController";
import { DeleteUserController } from "../../controllers/admin/users/DeleteUserController";
import { FindUserByController } from "../../controllers/admin/users/FindUserByController";
import { FindUserController } from "../../controllers/admin/users/FindUserController";
import { ListAllUsersController } from "../../controllers/admin/users/ListAllUsersController";
import { ListUsersByCompanyController } from "../../controllers/admin/users/ListUsersByCompanyController";
import { GetUserFiltersController } from "../../controllers/admin/users/GetUserFiltersController";
import { SearchUsersController } from "../../controllers/admin/users/SearchUsersController";
import { UpdateUserController } from "../../controllers/admin/users/UpdateUserController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminUserRouter = Router();

adminUserRouter.post("/", isAuthenticated, new CreateUserController().handle);
adminUserRouter.post("/create-many", isAuthenticated, new CreateManyUsersController().handle);
adminUserRouter.get("/find-by", isAuthenticated, new FindUserByController().handle);
adminUserRouter.get("/search", isAuthenticated, new SearchUsersController().handle);
adminUserRouter.get("/filters", isAuthenticated, new GetUserFiltersController().handle);
adminUserRouter.get("/", isAuthenticated, new ListAllUsersController().handle);
adminUserRouter.get("/company/:companyId", isAuthenticated, new ListUsersByCompanyController().handle);
adminUserRouter.get("/:userId", isAuthenticated, new FindUserController().handle);
adminUserRouter.put("/:id", isAuthenticated, new UpdateUserController().handle);
adminUserRouter.delete("/:id", isAuthenticated, new DeleteUserController().handle);

export { adminUserRouter };
