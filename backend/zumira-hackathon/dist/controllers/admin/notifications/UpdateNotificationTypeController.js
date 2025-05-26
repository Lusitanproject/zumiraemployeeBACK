"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationTypeController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const NotificationTypeAdminService_1 = require("../../../services/admin/NotificationTypeAdminService");
const notification_1 = require("../../../definitions/admin/notification");
class UpdateNotificationTypeController {
    async handle(req, res) {
        const { data, success, error } = notification_1.UpdateNotificationTypeSchema.safeParse({ ...req.body, ...req.params });
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NotificationTypeAdminService_1.NotificationTypeAdminService();
        const notification = await service.update(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.UpdateNotificationTypeController = UpdateNotificationTypeController;
