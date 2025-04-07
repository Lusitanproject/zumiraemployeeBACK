"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNationalitiesController = void 0;
const ListNationalitiesService_1 = require("../../services/nationality/ListNationalitiesService");
class ListNationalitiesController {
    async handle(req, res) {
        const listNationalities = new ListNationalitiesService_1.ListNationalitiesService();
        const nationalities = await listNationalities.execute();
        return res.json({ status: "SUCCESS", data: nationalities });
    }
}
exports.ListNationalitiesController = ListNationalitiesController;
