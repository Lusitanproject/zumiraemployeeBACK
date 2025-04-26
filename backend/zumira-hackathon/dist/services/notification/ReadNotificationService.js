"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadNotificationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ReadNotificationService {
    async execute({ userId, notificationId }) {
        try {
            await prisma_1.default.notificationRecipient.update({
                where: {
                    userId_notificationId: {
                        userId,
                        notificationId,
                    },
                },
                data: {
                    read: true,
                },
            });
        }
        catch {
            throw new Error("Recipient does not exist");
        }
    }
}
exports.ReadNotificationService = ReadNotificationService;
