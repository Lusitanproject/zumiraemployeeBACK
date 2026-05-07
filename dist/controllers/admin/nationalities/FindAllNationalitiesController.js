"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllNationalitiesController = void 0;
const NationalityAdminService_1 = require("../../../services/admin/NationalityAdminService");
class FindAllNationalitiesController {
    async handle(req, res) {
        const service = new NationalityAdminService_1.NationalityAdminService();
        const nationalities = await service.findAll();
        return res.json({ status: "SUCCESS", data: nationalities });
    }
}
exports.FindAllNationalitiesController = FindAllNationalitiesController;
