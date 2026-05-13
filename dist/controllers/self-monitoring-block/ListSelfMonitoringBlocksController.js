"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelfMonitoringBlocksController = void 0;
const SelfMonitoringBlockService_1 = require("../../services/self-monitoring-block/SelfMonitoringBlockService");
class ListSelfMonitoringBlocksController {
    async handle(req, res) {
        const listBlocks = new SelfMonitoringBlockService_1.SelfMonitoringBlockService();
        const blocks = await listBlocks.list();
        return res.json({ status: "SUCCESS", data: blocks });
    }
}
exports.ListSelfMonitoringBlocksController = ListSelfMonitoringBlocksController;
