"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditNotificationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class EditNotificationService {
    async execute({ notificationId, notificationTypeId, content, summary, title }) {
        try {
            const notification = await prisma_1.default.notification.update({
                where: {
                    id: notificationId,
                },
                data: {
                    content,
                    summary,
                    title,
                    notificationTypeId,
                },
            });
            return notification;
        }
        catch {
            throw new Error("Notification does not exist");
        }
    }
}
exports.EditNotificationService = EditNotificationService;
