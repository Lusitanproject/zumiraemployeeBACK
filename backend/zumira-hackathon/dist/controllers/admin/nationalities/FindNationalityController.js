"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindNationalityController = void 0;
const common_1 = require("../../../definitions/common");
const NationalityAdminService_1 = require("../../../services/admin/NationalityAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class FindNationalityController {
    async handle(req, res) {
        const { success, data, error } = common_1.RequestParamsIdCUID.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NationalityAdminService_1.NationalityAdminService();
        const nationality = await service.find(data.id);
        return res.json({ status: "SUCCESS", data: nationality });
    }
}
exports.FindNationalityController = FindNationalityController;
