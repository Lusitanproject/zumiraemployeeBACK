"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadAlertSchema = void 0;
const zod_1 = require("zod");
exports.ReadAlertSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
