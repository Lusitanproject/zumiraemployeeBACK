import { Router } from "express";

import { CreateActChatbotController } from "../../controllers/admin/acts/CreateActChatbotController";
import { FindActChatbotController } from "../../controllers/admin/acts/FindActChatbotController";
import { FindAllActChatbotsController } from "../../controllers/admin/acts/FindAllActChatbotsController";
import { FindByTrailController } from "../../controllers/admin/acts/FindByTrailController";
import { UpdateActChatbotController } from "../../controllers/admin/acts/UpdateActChatbotController";
import { UpdateManyActChatbotsController } from "../../controllers/admin/acts/UpdateManyActChatbotsController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const adminActsRoutes = Router();

adminActsRoutes.get("/admin", isAuthenticated, new FindAllActChatbotsController().handle);
adminActsRoutes.get("/admin/by-trail", isAuthenticated, new FindByTrailController().handle);
adminActsRoutes.get("/admin/:id", isAuthenticated, new FindActChatbotController().handle);
adminActsRoutes.put("/admin/update-many", isAuthenticated, new UpdateManyActChatbotsController().handle);
adminActsRoutes.put("/admin/:id", isAuthenticated, new UpdateActChatbotController().handle);
adminActsRoutes.post("/admin", isAuthenticated, new CreateActChatbotController().handle);

export { adminActsRoutes };
