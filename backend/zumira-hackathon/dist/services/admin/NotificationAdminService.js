"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const error_1 = require("../../error");
class NotificationAdminService {
    async findAll() {
        const notifications = await prisma_1.default.notification.findMany({
            select: {
                id: true,
                title: true,
                summary: true,
                content: true,
                actionUrl: true,
                notificationType: {
                    select: {
                        id: true,
                        name: true,
                        priority: true,
                        color: true,
                    },
                },
            },
        });
        return { notifications };
    }
    async findByType(notificationTypeId) {
        const notifications = await prisma_1.default.notification.findMany({
            where: { notificationTypeId },
            select: {
                id: true,
                title: true,
                summary: true,
                content: true,
                actionUrl: true,
                notificationType: {
                    select: {
                        id: true,
                        name: true,
                        priority: true,
                        color: true,
                    },
                },
            },
        });
        return { notifications };
    }
    async create({ title, summary, content, notificationTypeId, actionUrl, userIds }) {
        const users = await prisma_1.default.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        });
        const fetchedUsersIds = users.map((u) => u.id);
        for (const id of userIds) {
            if (!fetchedUsersIds.includes(id))
                throw new error_1.PublicError("Um ou mais usuários não existem");
        }
        const notification = await prisma_1.default.notification.create({
            data: {
                title,
                summary,
                content,
                actionUrl,
                notificationTypeId,
            },
        });
        await prisma_1.default.notificationRecipient.createMany({
            data: userIds.map((userId) => ({
                userId,
                notificationId: notification.id,
            })),
        });
        return notification;
    }
    async update({ notificationId, title, summary, content, notificationTypeId, actionUrl }) {
        try {
            const notification = await prisma_1.default.notification.update({
                where: {
                    id: notificationId,
                },
                data: {
                    title,
                    summary,
                    content,
                    actionUrl,
                    notificationTypeId,
                },
            });
            return notification;
        }
        catch {
            throw new error_1.PublicError("Notificação não existe");
        }
    }
    async delete({ notificationId }) {
        try {
            await prisma_1.default.notification.delete({
                where: {
                    id: notificationId,
                },
            });
        }
        catch {
            throw new error_1.PublicError("Notificação não existe");
        }
    }
}
exports.NotificationAdminService = NotificationAdminService;
