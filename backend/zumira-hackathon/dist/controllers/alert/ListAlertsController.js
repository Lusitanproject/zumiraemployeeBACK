"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlertsController = void 0;
const alert_1 = require("../../definitions/alert");
const ListAlertsService_1 = require("../../services/alert/ListAlertsService");
const parseZodError_1 = require("../../utils/parseZodError");
class ListAlertsController {
    async handle(req, res) {
        const { error, data, success } = alert_1.ListAlertsSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ListAlertsService_1.ListAlertsService();
        const result = await service.execute({ userId: req.user.id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ListAlertsController = ListAlertsController;
