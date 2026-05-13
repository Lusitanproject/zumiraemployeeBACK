"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPsychosocialFactorsController = void 0;
const PsychosocialFactorService_1 = require("../../services/psychosocial-factor/PsychosocialFactorService");
class ListPsychosocialFactorsController {
    async handle(req, res) {
        const service = new PsychosocialFactorService_1.PsychosocialFactorService();
        const factors = await service.findAll();
        return res.json({ status: "SUCCESS", data: factors });
    }
}
exports.ListPsychosocialFactorsController = ListPsychosocialFactorsController;
