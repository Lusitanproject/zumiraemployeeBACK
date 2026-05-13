"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindByCompanyController = void 0;
const act_chatbot_1 = require("../../schemas/admin/act-chatbot");
const ActService_1 = require("../../services/act/ActService");
const parseZodError_1 = require("../../utils/parseZodError");
class FindByCompanyController {
    async handle(req, res) {
        const { success, data, error } = act_chatbot_1.FindByCompanySchema.safeParse(req.query);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActService_1.ActService();
        const result = await service.findByCompany(data.companyId);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.FindByCompanyController = FindByCompanyController;
