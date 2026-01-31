"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelfMonitoringBlocksController = void 0;
const ListSelfMonitoringBlocksService_1 = require("../../services/self-monitoring-block/ListSelfMonitoringBlocksService");
class ListSelfMonitoringBlocksController {
    async handle(req, res) {
        const listBlocks = new ListSelfMonitoringBlocksService_1.ListSelfMonitoringBlocksService();
        const blocks = await listBlocks.execute();
        return res.json({ status: "SUCCESS", data: blocks });
    }
}
exports.ListSelfMonitoringBlocksController = ListSelfMonitoringBlocksController;
