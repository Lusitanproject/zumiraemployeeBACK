"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditNotificationSchema = exports.NotificationIdSchema = exports.ListNotificationsSchema = exports.CreateNotificationSchema = void 0;
const zod_1 = require("zod");
exports.CreateNotificationSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty(),
    summary: zod_1.z.string().nonempty(),
    content: zod_1.z.string().nonempty(),
    notificationTypeId: zod_1.z.string().cuid(),
    userIds: zod_1.z.array(zod_1.z.string().uuid()),
});
exports.ListNotificationsSchema = zod_1.z.object({
    filter: zod_1.z.enum(["recent", "unread"]),
});
exports.NotificationIdSchema = zod_1.z.object({
    notificationId: zod_1.z.string().cuid(),
});
exports.EditNotificationSchema = zod_1.z.object({
    notificationId: zod_1.z.string().cuid(),
    title: zod_1.z.string().nonempty(),
    summary: zod_1.z.string().nonempty(),
    content: zod_1.z.string().nonempty(),
    notificationTypeId: zod_1.z.string().cuid(),
});
