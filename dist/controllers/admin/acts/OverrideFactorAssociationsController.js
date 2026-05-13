"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverrideFactorAssociationsController = void 0;
const act_analysis_1 = require("../../../schemas/admin/act-analysis");
const ActService_1 = require("../../../services/act/ActService");
const parseZodError_1 = require("../../../utils/parseZodError");
class OverrideFactorAssociationsController {
    async handle(req, res) {
        const { success, data, error } = act_analysis_1.OverrideFactorAssociationsSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new ActService_1.ActService();
        await service.overrideFactorAssociations(data.overrides);
        return res.json({ status: "SUCCESS" });
    }
}
exports.OverrideFactorAssociationsController = OverrideFactorAssociationsController;
