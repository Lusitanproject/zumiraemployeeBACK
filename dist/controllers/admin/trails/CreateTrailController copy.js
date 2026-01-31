"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrailController = void 0;
const trail_1 = require("../../../definitions/admin/trail");
const TrailAdminService_1 = require("../../../services/admin/TrailAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class CreateTrailController {
    async handle(req, res) {
        const { success, data, error } = trail_1.CreateTrailSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new TrailAdminService_1.TrailAdminService();
        const result = await service.create(data);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CreateTrailController = CreateTrailController;
