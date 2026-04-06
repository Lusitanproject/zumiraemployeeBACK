"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationDetailResultController = void 0;
const zod_1 = require("zod");
const common_1 = require("../../../definitions/common");
const DetailResultService_1 = require("../../../services/assessment/DetailResultService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class IntegrationDetailResultController {
    async handle(req, res) {
        const { success, data, error } = RequestParamSchema.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { id: assessmentId } = data;
        const { userId } = userIdData;
        const service = new DetailResultService_1.DetailResultService();
        const result = await service.execute({ userId, assessmentId });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationDetailResultController = IntegrationDetailResultController;
