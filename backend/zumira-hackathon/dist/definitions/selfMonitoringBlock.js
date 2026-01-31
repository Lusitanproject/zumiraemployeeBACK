"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelfMonitoringBlockResultsSchema = void 0;
const zod_1 = require("zod");
exports.ListSelfMonitoringBlockResultsSchema = zod_1.z.object({
    selfMonitoringBlockId: zod_1.z.string().cuid().optional(),
});
