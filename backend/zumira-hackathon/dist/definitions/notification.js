"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationSchema = exports.NotificationIdSchema = exports.ListNotificationsSchema = exports.CreateNotificationSchema = void 0;
const zod_1 = require("zod");
exports.CreateNotificationSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty(),
    summary: zod_1.z.string().nonempty(),
    content: zod_1.z.string().nonempty().optional().nullable(),
    actionUrl: zod_1.z.string().nonempty().optional().nullable(),
    notificationTypeId: zod_1.z.string().cuid(),
    userIds: zod_1.z.array(zod_1.z.string().uuid()),
});
exports.ListNotificationsSchema = zod_1.z.object({
    filter: zod_1.z.enum(["recent", "unread"]),
    max: zod_1.z.coerce.number().int().positive().optional(),
});
exports.NotificationIdSchema = zod_1.z.object({
    notificationId: zod_1.z.string().cuid(),
});
exports.UpdateNotificationSchema = zod_1.z.object({
    notificationId: zod_1.z.string().cuid(),
    title: zod_1.z.string().nonempty(),
    summary: zod_1.z.string().nonempty(),
    content: zod_1.z.string().nonempty().optional().nullable(),
    actionUrl: zod_1.z.string().nonempty().optional().nullable(),
    notificationTypeId: zod_1.z.string().cuid(),
});
