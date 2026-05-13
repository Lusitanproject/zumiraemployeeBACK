"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class NotificationService {
    async detail({ notificationId }) {
        const notification = await prisma_1.default.notification.findFirst({
            where: { id: notificationId },
            select: {
                id: true,
                title: true,
                summary: true,
                content: true,
                actionUrl: true,
                notificationType: {
                    select: { id: true, name: true, color: true, priority: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        if (!notification)
            throw new error_1.PublicError("Notificação não existe");
        return notification;
    }
    async list({ userId, filter, max }) {
        const notifications = await prisma_1.default.notificationRecipient.findMany({
            where: {
                userId,
                read: filter === "recent" ? undefined : false,
            },
            select: {
                read: true,
                createdAt: true,
                notification: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                        content: true,
                        actionUrl: true,
                        notificationType: { select: { color: true, priority: true } },
                    },
                },
            },
            take: max,
            orderBy: { createdAt: "desc" },
        });
        return {
            notifications: notifications.map((n) => ({
                ...n.notification,
                read: n.read,
                receivedAt: n.createdAt,
            })),
        };
    }
    async read({ userId, notificationId }) {
        try {
            await prisma_1.default.notificationRecipient.update({
                where: { userId_notificationId: { userId, notificationId } },
                data: { read: true },
            });
        }
        catch {
            throw new error_1.PublicError("Destinatário não existe");
        }
    }
}
exports.NotificationService = NotificationService;
