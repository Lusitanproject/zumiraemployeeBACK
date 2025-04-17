"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotificationController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const notification_1 = require("../../../definitions/notification");
const NotificationAdminService_1 = require("../../../services/admin/NotificationAdminService");
class DeleteNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.NotificationIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NotificationAdminService_1.NotificationAdminService();
        await service.delete(data);
        return res.json({ status: "SUCCESS", data: {} });
    }
}
exports.DeleteNotificationController = DeleteNotificationController;
