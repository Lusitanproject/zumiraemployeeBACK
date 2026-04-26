"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nationalitiesRoutes = void 0;
const express_1 = require("express");
const ListNationalitiesController_1 = require("../controllers/nationality/ListNationalitiesController");
const nationalitiesRoutes = (0, express_1.Router)();
exports.nationalitiesRoutes = nationalitiesRoutes;
nationalitiesRoutes.get("/", new ListNationalitiesController_1.ListNationalitiesController().handle);
