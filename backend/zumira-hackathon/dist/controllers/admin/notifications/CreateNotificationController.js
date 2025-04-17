"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationController = void 0;
const notification_1 = require("../../../definitions/notification");
const parseZodError_1 = require("../../../utils/parseZodError");
const NotificationAdminService_1 = require("../../../services/admin/NotificationAdminService");
class CreateNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.CreateNotificationSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const notify = new NotificationAdminService_1.NotificationAdminService();
        const notification = await notify.create(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.CreateNotificationController = CreateNotificationController;
