"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileActChapterController = void 0;
const actChatbot_1 = require("../../definitions/actChatbot");
const CompileActChapterService_1 = require("../../services/actChatbot/CompileActChapterService");
const parseZodError_1 = require("../../utils/parseZodError");
class CompileActChapterController {
    async handle(req, res) {
        const { success, data, error } = actChatbot_1.CompileActChapterSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new CompileActChapterService_1.CompileActChapterService();
        const result = await service.execute({ ...data, userId: req.user.id });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.CompileActChapterController = CompileActChapterController;
