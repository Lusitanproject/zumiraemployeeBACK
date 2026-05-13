"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNationalitiesController = void 0;
const NationalityService_1 = require("../../services/nationality/NationalityService");
class ListNationalitiesController {
    async handle(req, res) {
        const listNationalities = new NationalityService_1.NationalityService();
        const nationalities = await listNationalities.list();
        return res.json({ status: "SUCCESS", data: nationalities });
    }
}
exports.ListNationalitiesController = ListNationalitiesController;
