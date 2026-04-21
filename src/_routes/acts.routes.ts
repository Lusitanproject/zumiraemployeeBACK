import { Router } from "express";

import { CompileActChapterController } from "../controllers/act/CompileActChapterController";
import { CreateActChapterController } from "../controllers/act/CreateActChapterController";
import { GetActChapterController } from "../controllers/act/GetActChapterController";
import { GetActsDataController } from "../controllers/act/GetActsDataController";
import { GetFullStoryController } from "../controllers/act/GetFullStoryController";
import { MessageActChatbotController } from "../controllers/act/MessageActChatbotController";
import { MoveToNextActController } from "../controllers/act/MoveToNextActController";
import { UpdateActChapterController } from "../controllers/act/UpdateActChapterController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const actsRoutes = Router();

actsRoutes.get("/", isAuthenticated, new GetActsDataController().handle);
actsRoutes.get("/chapters", isAuthenticated, new GetActChapterController().handle);
actsRoutes.put("/next", isAuthenticated, new MoveToNextActController().handle);
actsRoutes.post("/message", isAuthenticated, new MessageActChatbotController().handle);
actsRoutes.post("/new-chapter", isAuthenticated, new CreateActChapterController().handle);
actsRoutes.post("/chapters/compile", isAuthenticated, new CompileActChapterController().handle);
actsRoutes.put("/chapters/:actChapterId", isAuthenticated, new UpdateActChapterController().handle);
actsRoutes.get("/full-story", isAuthenticated, new GetFullStoryController().handle);

export { actsRoutes };
