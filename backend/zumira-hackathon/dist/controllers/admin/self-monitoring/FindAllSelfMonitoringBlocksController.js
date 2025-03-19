"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAllSelfMonitoringBlocksController = void 0;
const SelfMonitoringService_1 = require("../../../services/admin/SelfMonitoringService");
class ListAllSelfMonitoringBlocksController {
    async handle(req, res) {
        const selfMonitoringService = new SelfMonitoringService_1.SelfMonitoringAdminService();
        const blocks = await selfMonitoringService.findAll();
        return res.json({ status: "SUCCESS", data: { blocks } });
    }
}
exports.ListAllSelfMonitoringBlocksController = ListAllSelfMonitoringBlocksController;
