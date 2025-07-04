"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCompanyFeedbackSchema = void 0;
const zod_1 = require("zod");
exports.FindCompanyFeedbackSchema = zod_1.z.object({
    assessmentId: zod_1.z.string().cuid(),
});
