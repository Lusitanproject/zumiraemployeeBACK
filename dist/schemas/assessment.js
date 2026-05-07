"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateAllUserFeedbackParamsSchema = exports.ListAssessmentsSchema = void 0;
const zod_1 = require("zod");
exports.ListAssessmentsSchema = zod_1.z.object({
    nationalityId: zod_1.z.string().cuid().optional(),
});
/**
 * POST /companies/admin/:companyId/feedback/users
 */
exports.GenerateAllUserFeedbackParamsSchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
});
