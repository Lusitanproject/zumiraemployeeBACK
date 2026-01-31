"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllTypesController = void 0;
const NotificationTypeAdminService_1 = require("../../../services/admin/NotificationTypeAdminService");
class FindAllTypesController {
    async handle(req, res) {
        const service = new NotificationTypeAdminService_1.NotificationTypeAdminService();
        const types = await service.findAll();
        return res.json({ status: "SUCCESS", data: types });
    }
}
exports.FindAllTypesController = FindAllTypesController;
