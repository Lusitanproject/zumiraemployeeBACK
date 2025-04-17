"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotificationController = void 0;
const notification_1 = require("../../definitions/notification");
const parseZodError_1 = require("../../utils/parseZodError");
const DeleteNotificationService_1 = require("../../services/notification/DeleteNotificationService");
class DeleteNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.NotificationIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new DeleteNotificationService_1.DeleteNotificationService();
        await service.execute(data);
        return res.json({ status: "SUCCESS", data: {} });
    }
}
exports.DeleteNotificationController = DeleteNotificationController;
