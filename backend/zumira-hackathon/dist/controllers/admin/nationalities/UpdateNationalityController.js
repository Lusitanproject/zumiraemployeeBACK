"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNationalityController = void 0;
const nationality_1 = require("../../../definitions/admin/nationality");
const common_1 = require("../../../definitions/common");
const NationalityAdminService_1 = require("../../../services/admin/NationalityAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class UpdateNationalityController {
    async handle(req, res) {
        const { id } = common_1.RequestParamsIdCUID.parse(req.params);
        const { success, data, error } = nationality_1.UpdateNationalitySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NationalityAdminService_1.NationalityAdminService();
        const nationality = await service.update({ id, ...data });
        return res.json({ status: "SUCCESS", data: nationality });
    }
}
exports.UpdateNationalityController = UpdateNationalityController;
