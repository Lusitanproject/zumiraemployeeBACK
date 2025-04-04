"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditDimensionController = void 0;
const dimension_1 = require("../../../definitions/admin/dimension");
const parseZodError_1 = require("../../../utils/parseZodError");
const DimensionAdminService_1 = require("../../../services/admin/DimensionAdminService");
class EditDimensionController {
    async handle(req, res) {
        const { success, data, error } = dimension_1.EditDimensionSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new DimensionAdminService_1.DimensionAdminService();
        await service.edit(data);
        return res.json({ status: "SUUCESS", data: {} });
    }
}
exports.EditDimensionController = EditDimensionController;
