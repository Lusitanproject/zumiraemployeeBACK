"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlertsController = void 0;
const ListAlertsService_1 = require("../../services/alert/ListAlertsService");
class ListAlertsController {
    async handle(req, res) {
        const service = new ListAlertsService_1.ListAlertsService();
        const result = await service.execute(req.user.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ListAlertsController = ListAlertsController;
