"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllDimensionsController = void 0;
const DimensionAdminService_1 = require("../../../services/admin/DimensionAdminService");
class FindAllDimensionsController {
    async handle(req, res) {
        const dimensionAdminService = new DimensionAdminService_1.DimensionAdminService();
        const dimensions = await dimensionAdminService.findAll();
        return res.json({ status: "SUCCESS", data: { dimensions } });
    }
}
exports.FindAllDimensionsController = FindAllDimensionsController;
