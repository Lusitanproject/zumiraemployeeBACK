"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailNotificationController = void 0;
const notification_1 = require("../../definitions/notification");
const parseZodError_1 = require("../../utils/parseZodError");
const DetailNotificationService_1 = require("../../services/notification/DetailNotificationService");
class DetailNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.NotificationIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new DetailNotificationService_1.DetailNotificationService();
        const notification = await service.execute(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.DetailNotificationController = DetailNotificationController;
