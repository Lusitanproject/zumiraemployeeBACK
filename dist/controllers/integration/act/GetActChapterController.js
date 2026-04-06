"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationGetActChapterController = void 0;
const actChatbot_1 = require("../../../definitions/actChatbot");
const common_1 = require("../../../definitions/common");
const GetActChapterService_1 = require("../../../services/act/GetActChapterService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationGetActChapterController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw Error((0, parseZodError_1.parseZodError)(userIdError));
        const { success, data, error } = actChatbot_1.GetActChapterSchema.safeParse(req.query);
        if (!success)
            throw Error((0, parseZodError_1.parseZodError)(error));
        const { userId } = userIdData;
        const service = new GetActChapterService_1.GetActChapterService();
        const result = await service.execute({ ...data, userId });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationGetActChapterController = IntegrationGetActChapterController;
