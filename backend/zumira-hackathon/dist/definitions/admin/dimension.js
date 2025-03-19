"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDimensionSchema = void 0;
const zod_1 = require("zod");
exports.CreateDimensionSchema = zod_1.z.object({
    acronym: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    selfMonitoringBlockId: zod_1.z.string().cuid()
});
