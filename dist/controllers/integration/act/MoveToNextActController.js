"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMoveToNextActController = void 0;
const common_1 = require("../../../definitions/common");
const MoveToNextActService_1 = require("../../../services/act/MoveToNextActService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationMoveToNextActController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { userId } = userIdData;
        const service = new MoveToNextActService_1.MoveToNextActService();
        const result = await service.execute(userId);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationMoveToNextActController = IntegrationMoveToNextActController;
