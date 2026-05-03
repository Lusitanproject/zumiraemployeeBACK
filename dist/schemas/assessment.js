"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAssessmentsSchema = void 0;
const zod_1 = require("zod");
exports.ListAssessmentsSchema = zod_1.z.object({
    nationalityId: zod_1.z.string().cuid().optional(),
});
