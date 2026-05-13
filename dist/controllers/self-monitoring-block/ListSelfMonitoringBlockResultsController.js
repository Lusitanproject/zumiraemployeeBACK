"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelfMonitoringBlockResultsController = void 0;
const selfMonitoringBlock_1 = require("../../schemas/selfMonitoringBlock");
const SelfMonitoringBlockService_1 = require("../../services/self-monitoring-block/SelfMonitoringBlockService");
const parseZodError_1 = require("../../utils/parseZodError");
class ListSelfMonitoringBlockResultsController {
    async handle(req, res) {
        const { success, data, error } = selfMonitoringBlock_1.ListSelfMonitoringBlockResultsSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { selfMonitoringBlockId } = data;
        const userId = req.user.id;
        const listResults = new SelfMonitoringBlockService_1.SelfMonitoringBlockService();
        const results = await listResults.listResults({ userId, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: results });
    }
}
exports.ListSelfMonitoringBlockResultsController = ListSelfMonitoringBlockResultsController;
