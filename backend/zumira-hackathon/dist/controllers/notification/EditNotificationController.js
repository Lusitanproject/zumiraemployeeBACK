"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditNotificationController = void 0;
const notification_1 = require("../../definitions/notification");
const parseZodError_1 = require("../../utils/parseZodError");
const EditNotificationService_1 = require("../../services/notification/EditNotificationService");
class EditNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.EditNotificationSchema.safeParse({ ...req.body, ...req.params });
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new EditNotificationService_1.EditNotificationService();
        const notification = await service.execute(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.EditNotificationController = EditNotificationController;
