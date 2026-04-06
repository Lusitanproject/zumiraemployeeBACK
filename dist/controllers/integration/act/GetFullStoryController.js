"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationGetFullStoryController = void 0;
const common_1 = require("../../../definitions/common");
const GetFullStoryService_1 = require("../../../services/act/GetFullStoryService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationGetFullStoryController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { userId } = userIdData;
        const service = new GetFullStoryService_1.GetFullStoryService();
        const result = await service.execute(userId);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationGetFullStoryController = IntegrationGetFullStoryController;
