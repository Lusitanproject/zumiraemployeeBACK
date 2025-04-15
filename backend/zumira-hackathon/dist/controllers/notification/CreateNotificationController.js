"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationController = void 0;
const notification_1 = require("../../definitions/notification");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateNotificationService_1 = require("../../services/notification/CreateNotificationService");
class CreateNotificationController {
    async handle(req, res) {
        const { success, data, error } = notification_1.CreateNotificationSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const notify = new CreateNotificationService_1.CreateNotificationService();
        const notification = await notify.execute(data);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.CreateNotificationController = CreateNotificationController;
