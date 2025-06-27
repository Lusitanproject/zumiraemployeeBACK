"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManyActChatbotsSchema = exports.UpdateActChatbotSchema = exports.CreateActChatbotSchema = void 0;
const zod_1 = require("zod");
exports.CreateActChatbotSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    description: zod_1.z.string().nonempty(),
    messageInstructions: zod_1.z.string().nonempty().optional(),
    compilationInstructions: zod_1.z.string().nonempty().optional(),
    icon: zod_1.z.string().nonempty(),
});
exports.UpdateActChatbotSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().nonempty().optional(),
    description: zod_1.z.string().nonempty().optional(),
    messageInstructions: zod_1.z.string().nonempty().optional(),
    compilationInstructions: zod_1.z.string().nonempty().optional(),
    index: zod_1.z.number().int().optional(),
    icon: zod_1.z.string().nonempty().optional(),
});
exports.UpdateManyActChatbotsSchema = zod_1.z.object({
    chatbots: zod_1.z.array(exports.UpdateActChatbotSchema),
});
