"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateAssessmentController = void 0;
const common_1 = require("../../../definitions/common");
const AssessmentAdminService_1 = require("../../../services/admin/AssessmentAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
class DuplicateAssessmentController {
    async handle(req, res) {
        const { success, data, error } = common_1.RequestParamsIdCUID.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new AssessmentAdminService_1.AssessmentAdminService();
        const result = await service.duplicate(data.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.DuplicateAssessmentController = DuplicateAssessmentController;
