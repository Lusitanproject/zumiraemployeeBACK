"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindTrailController = void 0;
const common_1 = require("../../../definitions/common");
const TrailAdminService_1 = require("../../../services/admin/TrailAdminService");
class FindTrailController {
    async handle(req, res) {
        const { id } = common_1.RequestParamsIdCUID.parse(req.params);
        const service = new TrailAdminService_1.TrailAdminService();
        const result = await service.find(id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindTrailController = FindTrailController;
