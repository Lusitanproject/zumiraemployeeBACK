"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePsychosocialFactorController = void 0;
const psychosocial_factor_1 = require("../../../schemas/admin/psychosocial-factor");
const PsychosocialFactorAdminService_1 = require("../../../services/admin/PsychosocialFactorAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class DeletePsychosocialFactorController {
    async handle(req, res) {
        const { success, data, error } = psychosocial_factor_1.PsychosocialFactorIdSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new PsychosocialFactorAdminService_1.PsychosocialFactorAdminService();
        await service.delete(data.id);
        return res.json({ status: "SUCCESS", data: {} });
    }
}
exports.DeletePsychosocialFactorController = DeletePsychosocialFactorController;
