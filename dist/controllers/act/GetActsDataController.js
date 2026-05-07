"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActsDataController = void 0;
const GetActsDataService_1 = require("../../services/act/GetActsDataService");
class GetActsDataController {
    async handle(req, res) {
        const service = new GetActsDataService_1.GetActsDataService();
        const result = await service.execute(req.user.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.GetActsDataController = GetActsDataController;
