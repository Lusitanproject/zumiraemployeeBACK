"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindDimensionByBlockController = void 0;
const zod_1 = require("zod");
const DimensionAdminService_1 = require("../../../services/admin/DimensionAdminService");
const SelfMonitoringService_1 = require("../../../services/admin/SelfMonitoringService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParam = zod_1.z.object({
    selfMonitoringBlockId: zod_1.z.string().cuid(),
});
class FindDimensionByBlockController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const selfMonitoringAdminService = new SelfMonitoringService_1.SelfMonitoringAdminService();
        const monitoringBlockExists = await selfMonitoringAdminService.find(data.selfMonitoringBlockId);
        if (!monitoringBlockExists) {
            return res.status(400).json({
                status: "ERROR",
                message: "O bloco de autoconhecimento informado não existe.",
            });
        }
        const dimensionAdminService = new DimensionAdminService_1.DimensionAdminService();
        const dimensions = await dimensionAdminService.findBySelfMonitoring(data.selfMonitoringBlockId);
        return res.json({ status: "SUCCESS", data: { dimensions } });
    }
}
exports.FindDimensionByBlockController = FindDimensionByBlockController;
