"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllTrailsController = void 0;
const TrailAdminService_1 = require("../../../services/admin/TrailAdminService");
class FindAllTrailsController {
    async handle(req, res) {
        const service = new TrailAdminService_1.TrailAdminService();
        const result = await service.findAll();
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindAllTrailsController = FindAllTrailsController;
