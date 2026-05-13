"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationCompileActChapterController = void 0;
const actChatbot_1 = require("../../../schemas/actChatbot");
const ActService_1 = require("../../../services/act/ActService");
const parseZodError_1 = require("../../../utils/parseZodError");
const common_1 = require("../../../schemas/common");
class IntegrationCompileActChapterController {
    async handle(req, res) {
        const { success: userIdSuccess, data: userIdData, error: userIdError } = common_1.UserIdSchema.safeParse(req.query);
        if (!userIdSuccess)
            throw new Error((0, parseZodError_1.parseZodError)(userIdError));
        const { success, data, error } = actChatbot_1.CompileActChapterSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { userId } = userIdData;
        const service = new ActService_1.ActService();
        const result = await service.compileChapter({ ...data, userId });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.IntegrationCompileActChapterController = IntegrationCompileActChapterController;
