"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRouter = void 0;
const express_1 = require("express");
const FindCompanyFeedbackController_1 = require("../controllers/company/FindCompanyFeedbackController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const companyRouter = (0, express_1.Router)();
exports.companyRouter = companyRouter;
companyRouter.get("/:id/feedback", isAuthenticated_1.isAuthenticated, new FindCompanyFeedbackController_1.FindCompanyFeedbackController().handle);
