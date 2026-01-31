"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrailController = void 0;
const trail_1 = require("../../../definitions/admin/trail");
const common_1 = require("../../../definitions/common");
const TrailAdminService_1 = require("../../../services/admin/TrailAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class UpdateTrailController {
    async handle(req, res) {
        const { id } = common_1.RequestParamsIdCUID.parse(req.params);
        const { data, error, success } = trail_1.UpdateTrailSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new TrailAdminService_1.TrailAdminService();
        const result = await service.update({ id, ...data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.UpdateTrailController = UpdateTrailController;
