"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationGetActsDataController = void 0;
const common_1 = require("../../../definitions/common");
const GetActsDataService_1 = require("../../../services/act/GetActsDataService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationGetActsDataController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { userId } = userIdData;
        const service = new GetActsDataService_1.GetActsDataService();
        const result = await service.execute(userId);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationGetActsDataController = IntegrationGetActsDataController;
