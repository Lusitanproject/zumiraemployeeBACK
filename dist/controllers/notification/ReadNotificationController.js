"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadNotificationController = void 0;
const notification_1 = require("../../schemas/notification");
const NotificationService_1 = require("../../services/notification/NotificationService");
const parseZodError_1 = require("../../utils/parseZodError");
class ReadNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.NotificationIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userId = req.user.id;
        const service = new NotificationService_1.NotificationService();
        await service.read({ userId, ...data });
        return res.json({ status: "SUCCESS", data: {} });
    }
}
exports.ReadNotificationController = ReadNotificationController;
