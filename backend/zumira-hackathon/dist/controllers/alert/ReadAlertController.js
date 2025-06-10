"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadAlertController = void 0;
const alert_1 = require("../../definitions/alert");
const parseZodError_1 = require("../../utils/parseZodError");
const ReadAlertService_1 = require("../../services/alert/ReadAlertService");
class ReadAlertController {
    async handle(req, res) {
        const { success, data, error } = alert_1.ReadAlertSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ReadAlertService_1.ReadAlertService();
        const result = await service.execute(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ReadAlertController = ReadAlertController;
