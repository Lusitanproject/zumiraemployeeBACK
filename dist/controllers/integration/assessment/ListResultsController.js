"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationListResultsController = void 0;
const common_1 = require("../../../definitions/common");
const ListResultsService_1 = require("../../../services/assessment/ListResultsService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationListResultsController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { userId } = userIdData;
        const service = new ListResultsService_1.ListResultsService();
        const results = await service.execute(userId);
        return res.json({ status: "SUCCESS", data: results });
    }
}
exports.IntegrationListResultsController = IntegrationListResultsController;
