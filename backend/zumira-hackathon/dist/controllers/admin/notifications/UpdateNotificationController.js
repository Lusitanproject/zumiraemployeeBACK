"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationController = void 0;
const notification_1 = require("../../../definitions/notification");
const NotificationAdminService_1 = require("../../../services/admin/NotificationAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class UpdateNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.UpdateNotificationSchema.safeParse({ ...req.body, ...req.params });
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NotificationAdminService_1.NotificationAdminService();
        const notification = await service.update(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.UpdateNotificationController = UpdateNotificationController;
