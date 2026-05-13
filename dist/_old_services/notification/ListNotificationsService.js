"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNotificationsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListNotificationsService {
    async execute({ userId, filter, max }) {
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
                        notificationType: {
                            select: {
                                color: true,
                                priority: true,
                            },
                        },
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
}
exports.ListNotificationsService = ListNotificationsService;
