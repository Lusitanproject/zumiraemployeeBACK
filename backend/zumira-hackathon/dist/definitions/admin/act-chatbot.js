"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderActChatbotsSchema = exports.UpdateActChatbotSchema = exports.CreateActChatbotSchema = void 0;
const zod_1 = require("zod");
exports.CreateActChatbotSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    description: zod_1.z.string().nonempty(),
    instructions: zod_1.z.string().nonempty(),
    icon: zod_1.z.string().nonempty(),
});
exports.UpdateActChatbotSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().nonempty(),
    description: zod_1.z.string().nonempty(),
    instructions: zod_1.z.string().nonempty(),
    icon: zod_1.z.string().nonempty(),
});
exports.ReorderActChatbotsSchema = zod_1.z.object({
    chatbots: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().cuid(),
        nextActChatbotId: zod_1.z.string().cuid().nullable(),
    })),
});
