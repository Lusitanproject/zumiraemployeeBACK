"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNationalityController = void 0;
const nationality_1 = require("../../../definitions/admin/nationality");
const NationalityAdminService_1 = require("../../../services/admin/NationalityAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateNationalityController {
    async handle(req, res) {
        const { success, data, error } = nationality_1.CreateNationalitySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NationalityAdminService_1.NationalityAdminService();
        const nationality = await service.create(data);
        return res.json({ status: "SUCCESS", data: nationality });
    }
}
exports.CreateNationalityController = CreateNationalityController;
