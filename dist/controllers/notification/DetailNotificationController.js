"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailNotificationController = void 0;
const notification_1 = require("../../schemas/notification");
const NotificationService_1 = require("../../services/notification/NotificationService");
const parseZodError_1 = require("../../utils/parseZodError");
class DetailNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.NotificationIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NotificationService_1.NotificationService();
        const notification = await service.detail(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.DetailNotificationController = DetailNotificationController;
