"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadNotificationService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const error_1 = require("../../error");
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
            throw new error_1.PublicError("Destinatário não existe");
        }
    }
}
exports.ReadNotificationService = ReadNotificationService;
