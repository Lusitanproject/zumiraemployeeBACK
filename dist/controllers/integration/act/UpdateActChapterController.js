"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationUpdateActChapterController = void 0;
const actChatbot_1 = require("../../../definitions/actChatbot");
const common_1 = require("../../../definitions/common");
const UpdateActChapterService_1 = require("../../../services/act/UpdateActChapterService");
const parseZodError_1 = require("../../../utils/parseZodError");
class IntegrationUpdateActChapterController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { success, data, error } = actChatbot_1.UpdateActChapterSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { userId } = userIdData;
        const service = new UpdateActChapterService_1.UpdateActChapterService();
        const result = await service.execute({ ...data, userId });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationUpdateActChapterController = IntegrationUpdateActChapterController;
