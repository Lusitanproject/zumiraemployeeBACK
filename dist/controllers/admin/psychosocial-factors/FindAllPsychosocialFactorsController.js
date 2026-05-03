"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllPsychosocialFactorsController = void 0;
const PsychosocialFactorAdminService_1 = require("../../../services/admin/PsychosocialFactorAdminService");
class FindAllPsychosocialFactorsController {
    async handle(req, res) {
        const service = new PsychosocialFactorAdminService_1.PsychosocialFactorAdminService();
        const factors = await service.findAll();
        return res.json({ status: "SUCCESS", data: factors });
    }
}
exports.FindAllPsychosocialFactorsController = FindAllPsychosocialFactorsController;
