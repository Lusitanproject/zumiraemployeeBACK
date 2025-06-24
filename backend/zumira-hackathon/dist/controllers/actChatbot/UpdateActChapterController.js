"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActChapterController = void 0;
const actChatbot_1 = require("../../definitions/actChatbot");
const UpdateActChapterService_1 = require("../../services/actChatbot/UpdateActChapterService");
const parseZodError_1 = require("../../utils/parseZodError");
class UpdateActChapterController {
    async handle(req, res) {
        const { success, data, error } = actChatbot_1.UpdateActChapterSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new UpdateActChapterService_1.UpdateActChapterService();
        const result = await service.execute({ ...data, userId: req.user.id });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.UpdateActChapterController = UpdateActChapterController;
