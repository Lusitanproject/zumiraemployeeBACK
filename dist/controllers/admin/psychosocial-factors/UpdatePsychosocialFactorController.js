"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePsychosocialFactorController = void 0;
const psychosocial_factor_1 = require("../../../schemas/admin/psychosocial-factor");
const PsychosocialFactorAdminService_1 = require("../../../services/admin/PsychosocialFactorAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class UpdatePsychosocialFactorController {
    async handle(req, res) {
        const { success: idSuccess, data: idData, error: idError } = psychosocial_factor_1.PsychosocialFactorIdSchema.safeParse(req.params);
        if (!idSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(idError));
        const { success, data, error } = psychosocial_factor_1.UpdatePsychosocialFactorSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new PsychosocialFactorAdminService_1.PsychosocialFactorAdminService();
        const factor = await service.update({ id: idData.id, ...data });
        return res.json({ status: "SUCCESS", data: factor });
    }
}
exports.UpdatePsychosocialFactorController = UpdatePsychosocialFactorController;
