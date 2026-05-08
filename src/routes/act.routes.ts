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

const actRouter = Router();

actRouter.get("/", isAuthenticated, new GetActsDataController().handle);
actRouter.get("/chapters", isAuthenticated, new GetActChapterController().handle);
actRouter.get("/full-story", isAuthenticated, new GetFullStoryController().handle);
actRouter.put("/next", isAuthenticated, new MoveToNextActController().handle);
actRouter.post("/message", isAuthenticated, new MessageActChatbotController().handle);
actRouter.post("/new-chapter", isAuthenticated, new CreateActChapterController().handle);
actRouter.post("/chapters/compile", isAuthenticated, new CompileActChapterController().handle);
actRouter.put("/chapters/:actChapterId", isAuthenticated, new UpdateActChapterController().handle);

export { actRouter };
