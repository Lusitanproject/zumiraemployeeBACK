"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllNotificationsController = void 0;
const NotificationAdminService_1 = require("../../../services/admin/NotificationAdminService");
class FindAllNotificationsController {
    async handle(req, res) {
        const service = new NotificationAdminService_1.NotificationAdminService();
        const notifications = await service.findAll();
        return res.json({ status: "SUCCESS", data: notifications });
    }
}
exports.FindAllNotificationsController = FindAllNotificationsController;
