import { Router } from "express";

import { ListNationalitiesController } from "../controllers/nationality/ListNationalitiesController";

const nationalitiesRoutes = Router();

nationalitiesRoutes.get("/", new ListNationalitiesController().handle);

export { nationalitiesRoutes };
