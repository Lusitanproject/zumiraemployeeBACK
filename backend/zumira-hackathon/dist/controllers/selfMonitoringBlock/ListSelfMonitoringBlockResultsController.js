"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelfMonitoringBlockResultsController = void 0;
const selfMonitoringBlock_1 = require("../../definitions/selfMonitoringBlock");
const ListSelfMonitoringBlockResultsService_1 = require("../../services/selfMonitoringBlock/ListSelfMonitoringBlockResultsService");
const parseZodError_1 = require("../../utils/parseZodError");
class ListSelfMonitoringBlockResultsController {
    async handle(req, res) {
        const { success, data, error } = selfMonitoringBlock_1.ListSelfMonitoringBlockResultsSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { selfMonitoringBlockId } = data;
        const userId = req.user.id;
        const listResults = new ListSelfMonitoringBlockResultsService_1.ListSelfMonitoringBlockResultsService();
        const results = await listResults.execute({ userId, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: results });
    }
}
exports.ListSelfMonitoringBlockResultsController = ListSelfMonitoringBlockResultsController;
