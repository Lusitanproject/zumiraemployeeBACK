"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindByTrailSchema = exports.UpdateManyActChatbotsSchema = exports.UpdateActChatbotSchema = exports.CreateActChatbotSchema = void 0;
const zod_1 = require("zod");
exports.CreateActChatbotSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    description: zod_1.z.string().nonempty(),
    initialMessage: zod_1.z.string().optional(),
    messageInstructions: zod_1.z.string().nonempty().optional(),
    compilationInstructions: zod_1.z.string().nonempty().optional(),
    icon: zod_1.z.string().nonempty(),
    trailId: zod_1.z.string().cuid(),
});
exports.UpdateActChatbotSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().nonempty().optional(),
    description: zod_1.z.string().nonempty().optional(),
    initialMessage: zod_1.z.string().optional(),
    messageInstructions: zod_1.z.string().nonempty().optional(),
    compilationInstructions: zod_1.z.string().nonempty().optional(),
    index: zod_1.z.number().int().optional(),
    icon: zod_1.z.string().nonempty().optional(),
    trailId: zod_1.z.string().cuid().optional(),
});
exports.UpdateManyActChatbotsSchema = zod_1.z.object({
    chatbots: zod_1.z.array(exports.UpdateActChatbotSchema),
});
exports.FindByTrailSchema = zod_1.z.object({
    trailId: zod_1.z.string().cuid(),
});
