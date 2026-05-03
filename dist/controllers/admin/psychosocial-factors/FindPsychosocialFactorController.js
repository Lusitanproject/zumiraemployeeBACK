"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPsychosocialFactorController = void 0;
const psychosocial_factor_1 = require("../../../schemas/admin/psychosocial-factor");
const PsychosocialFactorAdminService_1 = require("../../../services/admin/PsychosocialFactorAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class FindPsychosocialFactorController {
    async handle(req, res) {
        const { success, data, error } = psychosocial_factor_1.PsychosocialFactorIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new PsychosocialFactorAdminService_1.PsychosocialFactorAdminService();
        const factor = await service.find(data.id);
        return res.json({ status: "SUCCESS", data: factor });
    }
}
exports.FindPsychosocialFactorController = FindPsychosocialFactorController;
