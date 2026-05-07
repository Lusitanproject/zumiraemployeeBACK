"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPsychologicalDimensionsController = void 0;
const ListPsychologicalDimensionsService_1 = require("../../services/psychological-dimension/ListPsychologicalDimensionsService");
class ListPsychologicalDimensionsController {
    async handle(req, res) {
        const listDimensions = new ListPsychologicalDimensionsService_1.ListPsychologicalDimensionsService();
        const dimensions = await listDimensions.execute();
        return res.json({ status: "SUCCESS", data: { dimensions } });
    }
}
exports.ListPsychologicalDimensionsController = ListPsychologicalDimensionsController;
