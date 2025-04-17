"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateNotificationService {
    async execute({ title, summary, content, notificationTypeId, userIds }) {
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
                throw new Error("One or more users does not exist");
        }
        const notification = await prisma_1.default.notification.create({
            data: {
                title,
                summary,
                content,
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
}
exports.CreateNotificationService = CreateNotificationService;
