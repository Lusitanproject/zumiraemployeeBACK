"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadAlertController = void 0;
const alert_1 = require("../../schemas/alert");
const AlertService_1 = require("../../services/alert/AlertService");
const parseZodError_1 = require("../../utils/parseZodError");
class ReadAlertController {
    async handle(req, res) {
        const { success, data, error } = alert_1.ReadAlertSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AlertService_1.AlertService();
        const result = await service.read(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ReadAlertController = ReadAlertController;
