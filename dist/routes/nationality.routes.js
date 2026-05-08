"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nationalityRouter = void 0;
const express_1 = require("express");
const ListNationalitiesController_1 = require("../controllers/nationality/ListNationalitiesController");
const nationalityRouter = (0, express_1.Router)();
exports.nationalityRouter = nationalityRouter;
nationalityRouter.get("/", new ListNationalitiesController_1.ListNationalitiesController().handle);
