"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindDimensionController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../../utils/parseZodError");
const DimensionAdminService_1 = require("../../../services/admin/DimensionAdminService");
const RequestParam = zod_1.z.object({
    psychologicalDimensionId: zod_1.z.string().uuid(),
});
class FindDimensionController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new DimensionAdminService_1.DimensionAdminService();
        const dimension = await service.find(data.psychologicalDimensionId);
        return res.json({ status: "SUCCESS", data: dimension });
    }
}
exports.FindDimensionController = FindDimensionController;
