import { Router } from "express";

import { IntegrationCompileActChapterController } from "../../controllers/integration/act/CompileActChapterController";
import { IntegrationCreateActChapterController } from "../../controllers/integration/act/CreateActChapterController";
import { IntegrationGetActChapterController } from "../../controllers/integration/act/GetActChapterController";
import { IntegrationGetActsDataController } from "../../controllers/integration/act/GetActsDataController";
import { IntegrationGetFullStoryController } from "../../controllers/integration/act/GetFullStoryController";
import { IntegrationMessageActChatbotController } from "../../controllers/integration/act/MessageActChatbotController";
import { IntegrationMoveToNextActController } from "../../controllers/integration/act/MoveToNextActController";
import { IntegrationUpdateActChapterController } from "../../controllers/integration/act/UpdateActChapterController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const integrationActsRoutes = Router();

integrationActsRoutes.get("/", isAuthenticated, new IntegrationGetActsDataController().handle);
integrationActsRoutes.get("/chapters", isAuthenticated, new IntegrationGetActChapterController().handle);
integrationActsRoutes.put("/next", isAuthenticated, new IntegrationMoveToNextActController().handle);
integrationActsRoutes.post("/message", isAuthenticated, new IntegrationMessageActChatbotController().handle);
integrationActsRoutes.post("/new-chapter", isAuthenticated, new IntegrationCreateActChapterController().handle);
integrationActsRoutes.post("/chapters/compile", isAuthenticated, new IntegrationCompileActChapterController().handle);
integrationActsRoutes.put(
  "/chapters/:actChapterId",
  isAuthenticated,
  new IntegrationUpdateActChapterController().handle,
);
integrationActsRoutes.get("/full-story", isAuthenticated, new IntegrationGetFullStoryController().handle);

export { integrationActsRoutes };
