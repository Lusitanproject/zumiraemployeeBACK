"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotificationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteNotificationService {
    async execute({ notificationId }) {
        try {
            await prisma_1.default.notification.delete({
                where: {
                    id: notificationId,
                },
            });
        }
        catch {
            throw new Error("Notification does not exist");
        }
    }
}
exports.DeleteNotificationService = DeleteNotificationService;
