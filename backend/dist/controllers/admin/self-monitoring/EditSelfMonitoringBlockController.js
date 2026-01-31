"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditSelfMonitoringBlocksController = void 0;
const zod_1 = require("zod");
const self_monitoring_1 = require("../../../definitions/admin/self-monitoring");
const SelfMonitoringService_1 = require("../../../services/admin/SelfMonitoringService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class EditSelfMonitoringBlocksController {
    async handle(req, res) {
        const { id } = RequestParamSchema.parse(req.params);
        const { success, data, error } = self_monitoring_1.EditSelfMonitoringBlockSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const selfMonitoringService = new SelfMonitoringService_1.SelfMonitoringAdminService();
        const block = await selfMonitoringService.update({ ...data, id });
        return res.json({ status: "SUCCESS", data: block });
    }
}
exports.EditSelfMonitoringBlocksController = EditSelfMonitoringBlocksController;
