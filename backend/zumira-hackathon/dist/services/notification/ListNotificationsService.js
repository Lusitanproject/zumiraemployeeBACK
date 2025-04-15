"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNotificationsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListNotificationsService {
    async execute({ userId, filter }) {
        const notifications = await prisma_1.default.notificationRecipient.findMany({
            where: {
                userId,
                read: filter === "recent" ? undefined : false,
            },
            select: {
                read: true,
                notification: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                    },
                },
            },
            take: filter === "recent" ? 30 : undefined,
            orderBy: { createdAt: "desc" },
        });
        return {
            notifications: notifications.map((n) => ({
                ...n.notification,
                read: n.read,
            })),
        };
    }
}
exports.ListNotificationsService = ListNotificationsService;
