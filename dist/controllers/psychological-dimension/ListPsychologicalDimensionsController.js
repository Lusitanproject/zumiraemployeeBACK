"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPsychologicalDimensionsController = void 0;
const PsychologicalDimensionService_1 = require("../../services/psychological-dimension/PsychologicalDimensionService");
class ListPsychologicalDimensionsController {
    async handle(req, res) {
        const listDimensions = new PsychologicalDimensionService_1.PsychologicalDimensionService();
        const dimensions = await listDimensions.list();
        return res.json({ status: "SUCCESS", data: { dimensions } });
    }
}
exports.ListPsychologicalDimensionsController = ListPsychologicalDimensionsController;
