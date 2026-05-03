"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadAlertSchema = exports.ListAlertsSchema = void 0;
const zod_1 = require("zod");
exports.ListAlertsSchema = zod_1.z.object({
    filter: zod_1.z.enum(["recent", "unread"]),
    max: zod_1.z.coerce.number().int().positive().optional(),
});
exports.ReadAlertSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
