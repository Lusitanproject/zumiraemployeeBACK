"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlertsController = void 0;
const alert_1 = require("../../schemas/alert");
const AlertService_1 = require("../../services/alert/AlertService");
const parseZodError_1 = require("../../utils/parseZodError");
class ListAlertsController {
    async handle(req, res) {
        const { error, data, success } = alert_1.ListAlertsSchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AlertService_1.AlertService();
        const result = await service.list({ userId: req.user.id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ListAlertsController = ListAlertsController;
