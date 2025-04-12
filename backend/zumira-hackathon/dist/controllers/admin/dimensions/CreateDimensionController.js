"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDimensionController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const dimension_1 = require("../../../definitions/admin/dimension");
const SelfMonitoringService_1 = require("../../../services/admin/SelfMonitoringService");
const DimensionAdminService_1 = require("../../../services/admin/DimensionAdminService");
class CreateDimensionController {
    async handle(req, res) {
        const { success, data, error } = dimension_1.CreateDimensionSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const { acronym, name, selfMonitoringBlockId } = data;
        const selfMonitoringAdminService = new SelfMonitoringService_1.SelfMonitoringAdminService();
        const monitoringBlockExists = await selfMonitoringAdminService.find(selfMonitoringBlockId);
        if (!monitoringBlockExists) {
            return res.status(400).json({
                status: "ERROR",
                message: "O bloco de autoconhecimento informado não existe.",
            });
        }
        const dimensionAdminService = new DimensionAdminService_1.DimensionAdminService();
        const dimension = await dimensionAdminService.create({ acronym, name, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: dimension });
    }
}
exports.CreateDimensionController = CreateDimensionController;
