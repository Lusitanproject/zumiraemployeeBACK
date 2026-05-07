import { Router } from "express";

import { CreateActChatbotController } from "../../controllers/admin/acts/CreateActChatbotController";
import { FindActChatbotController } from "../../controllers/admin/acts/FindActChatbotController";
import { FindAllActChatbotsController } from "../../controllers/admin/acts/FindAllActChatbotsController";
import { FindByCompanyController } from "../../controllers/admin/acts/FindByCompanyController";
import { FindByTrailController } from "../../controllers/admin/acts/FindByTrailController";
import { ImportChatbaseChaptersController } from "../../controllers/admin/acts/ImportChatbaseChaptersController";
import { UpdateActChatbotController } from "../../controllers/admin/acts/UpdateActChatbotController";
import { UpdateManyActChatbotsController } from "../../controllers/admin/acts/UpdateManyActChatbotsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminActRouter = Router();

adminActRouter.get("/", isAuthenticated, new FindAllActChatbotsController().handle);
adminActRouter.get("/by-trail", isAuthenticated, new FindByTrailController().handle);
adminActRouter.get("/by-company", isAuthenticated, new FindByCompanyController().handle);
adminActRouter.put("/update-many", isAuthenticated, new UpdateManyActChatbotsController().handle);
adminActRouter.get("/:id", isAuthenticated, new FindActChatbotController().handle);
adminActRouter.put("/:id", isAuthenticated, new UpdateActChatbotController().handle);
adminActRouter.post("/", isAuthenticated, new CreateActChatbotController().handle);
adminActRouter.post("/:id/import-chatbase-chapters", isAuthenticated, new ImportChatbaseChaptersController().handle);

export { adminActRouter };
