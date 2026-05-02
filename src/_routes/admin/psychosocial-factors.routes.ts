import { Router } from "express";

import { CreatePsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/CreatePsychosocialFactorController";
import { DeletePsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/DeletePsychosocialFactorController";
import { FindAllPsychosocialFactorsController } from "../../controllers/admin/psychosocial-factors/FindAllPsychosocialFactorsController";
import { FindPsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/FindPsychosocialFactorController";
import { UpdatePsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/UpdatePsychosocialFactorController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminPsychosocialFactorsRoutes = Router();

adminPsychosocialFactorsRoutes.get("/admin", isAuthenticated, new FindAllPsychosocialFactorsController().handle);
adminPsychosocialFactorsRoutes.post("/admin", isAuthenticated, new CreatePsychosocialFactorController().handle);
adminPsychosocialFactorsRoutes.get("/admin/:id", isAuthenticated, new FindPsychosocialFactorController().handle);
adminPsychosocialFactorsRoutes.put("/admin/:id", isAuthenticated, new UpdatePsychosocialFactorController().handle);
adminPsychosocialFactorsRoutes.delete("/admin/:id", isAuthenticated, new DeletePsychosocialFactorController().handle);

export { adminPsychosocialFactorsRoutes };
