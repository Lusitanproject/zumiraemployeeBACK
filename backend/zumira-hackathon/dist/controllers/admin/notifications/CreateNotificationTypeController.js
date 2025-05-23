"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationTypeController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const NotificationTypeAdminService_1 = require("../../../services/admin/NotificationTypeAdminService");
const notification_1 = require("../../../definitions/admin/notification");
class CreateNotificationTypeController {
    async handle(req, res) {
        const { data, success, error } = notification_1.CreateNotificationTypeSchema.safeParse({ ...req.body });
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NotificationTypeAdminService_1.NotificationTypeAdminService();
        const notification = await service.create(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.CreateNotificationTypeController = CreateNotificationTypeController;
