import { Router } from "express";

import { CreatePsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/CreatePsychosocialFactorController";
import { DeletePsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/DeletePsychosocialFactorController";
import { FindAllPsychosocialFactorsController } from "../../controllers/admin/psychosocial-factors/FindAllPsychosocialFactorsController";
import { FindPsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/FindPsychosocialFactorController";
import { UpdatePsychosocialFactorController } from "../../controllers/admin/psychosocial-factors/UpdatePsychosocialFactorController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminPsychosocialFactorRouter = Router();

adminPsychosocialFactorRouter.get("/", isAuthenticated, new FindAllPsychosocialFactorsController().handle);
adminPsychosocialFactorRouter.post("/", isAuthenticated, new CreatePsychosocialFactorController().handle);
adminPsychosocialFactorRouter.get("/:id", isAuthenticated, new FindPsychosocialFactorController().handle);
adminPsychosocialFactorRouter.put("/:id", isAuthenticated, new UpdatePsychosocialFactorController().handle);
adminPsychosocialFactorRouter.delete("/:id", isAuthenticated, new DeletePsychosocialFactorController().handle);

export { adminPsychosocialFactorRouter };
