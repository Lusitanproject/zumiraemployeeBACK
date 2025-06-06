"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActConversationSchema = exports.MessageActChatbotSchema = exports.GetActConversationSchema = void 0;
const zod_1 = require("zod");
exports.GetActConversationSchema = zod_1.z.object({
    actConversationId: zod_1.z.string().cuid(),
});
exports.MessageActChatbotSchema = zod_1.z.object({
    actConversationId: zod_1.z.string().cuid(),
    content: zod_1.z.string().nonempty(),
});
exports.CreateActConversationSchema = zod_1.z.object({
    actChatbotId: zod_1.z.string().cuid(),
});
