"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNotificationsController = void 0;
const ListNotificationsService_1 = require("../../services/notification/ListNotificationsService");
const notification_1 = require("../../definitions/notification");
const parseZodError_1 = require("../../utils/parseZodError");
class ListNotificationsController {
    async handle(req, res) {
        const { success, data, error } = notification_1.ListNotificationsSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const userId = req.user.id;
        const listNotifications = new ListNotificationsService_1.ListNotificationsService();
        const notifications = await listNotifications.execute({ userId, ...data });
        return res.json({ status: "SUCCESS", data: notifications });
    }
}
exports.ListNotificationsController = ListNotificationsController;
