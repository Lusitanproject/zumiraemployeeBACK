"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsychosocialFactorIdSchema = exports.UpdatePsychosocialFactorSchema = exports.CreatePsychosocialFactorSchema = void 0;
const zod_1 = require("zod");
exports.CreatePsychosocialFactorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    wheight: zod_1.z.number().int(),
    description: zod_1.z.string().min(1),
    selfMonitoringBlockId: zod_1.z.string(),
});
exports.UpdatePsychosocialFactorSchema = exports.CreatePsychosocialFactorSchema;
exports.PsychosocialFactorIdSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
