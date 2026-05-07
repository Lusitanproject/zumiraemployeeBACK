"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailNotificationService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class DetailNotificationService {
    async execute({ notificationId }) {
        const notification = await prisma_1.default.notification.findFirst({
            where: {
                id: notificationId,
            },
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
                        color: true,
                        priority: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!notification)
            throw new error_1.PublicError("Notificação não existe");
        return notification;
    }
}
exports.DetailNotificationService = DetailNotificationService;
