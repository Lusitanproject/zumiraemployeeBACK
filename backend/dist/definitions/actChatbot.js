"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActChapterSchema = exports.CompileActChapterSchema = exports.CreateActChapterSchema = exports.MessageActChatbotSchema = exports.GetActChapterSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.GetActChapterSchema = zod_1.z.object({
    actChapterId: zod_1.z.string().cuid(),
});
exports.MessageActChatbotSchema = zod_1.z.object({
    actChapterId: zod_1.z.string().cuid(),
    content: zod_1.z.string().nonempty(),
});
exports.CreateActChapterSchema = zod_1.z.object({
    actChatbotId: zod_1.z.string().cuid(),
    type: zod_1.z.nativeEnum(client_1.ChapterType),
});
exports.CompileActChapterSchema = zod_1.z.object({
    actChapterId: zod_1.z.string().cuid(),
});
exports.UpdateActChapterSchema = zod_1.z.object({
    actChapterId: zod_1.z.string().cuid(),
    title: zod_1.z.string().nonempty().optional(),
    compilation: zod_1.z.string().nullable().optional(),
});
