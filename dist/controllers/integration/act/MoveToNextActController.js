"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMoveToNextActController = void 0;
const common_1 = require("../../../schemas/common");
const ActService_1 = require("../../../services/act/ActService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationMoveToNextActController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { userId } = userIdData;
        const service = new ActService_1.ActService();
        const result = await service.moveToNext(userId);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationMoveToNextActController = IntegrationMoveToNextActController;
