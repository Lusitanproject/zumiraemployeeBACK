"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSelfMonitoringBlocksController = void 0;
const SelfMonitoringService_1 = require("../../../services/admin/SelfMonitoringService");
const self_monitoring_1 = require("../../../definitions/admin/self-monitoring");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateSelfMonitoringBlocksController {
    async handle(req, res) {
        const { success, data, error } = self_monitoring_1.CreateSelfMonitoringBlockSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error)
            });
        }
        const selfMonitoringService = new SelfMonitoringService_1.SelfMonitoringAdminService();
        const block = await selfMonitoringService.create(data);
        return res.json({ status: "SUCCESS", data: block });
    }
}
exports.CreateSelfMonitoringBlocksController = CreateSelfMonitoringBlocksController;
