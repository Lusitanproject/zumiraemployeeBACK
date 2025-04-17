"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSelfMonitoringBlocksController = void 0;
const SelfMonitoringService_1 = require("../../../services/admin/SelfMonitoringService");
const zod_1 = require("zod");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParam = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class FindSelfMonitoringBlocksController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success) {
            return res.status(400).json({
                status: "ERROR",
                message: (0, parseZodError_1.parseZodError)(error),
            });
        }
        const selfMonitoringService = new SelfMonitoringService_1.SelfMonitoringAdminService();
        const block = await selfMonitoringService.find(data.id);
        return res.json({ status: "SUCCESS", data: block });
    }
}
exports.FindSelfMonitoringBlocksController = FindSelfMonitoringBlocksController;
