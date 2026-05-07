import { Router } from "express";

import { ListNationalitiesController } from "../controllers/nationality/ListNationalitiesController";

const nationalityRouter = Router();

nationalityRouter.get("/", new ListNationalitiesController().handle);

export { nationalityRouter };
