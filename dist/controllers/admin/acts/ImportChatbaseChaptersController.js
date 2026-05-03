"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportChatbaseChaptersController = void 0;
const zod_1 = require("zod");
const act_chatbot_1 = require("../../../schemas/admin/act-chatbot");
const ActChatbotAdminService_1 = require("../../../services/admin/ActChatbotAdminService");
const parseZodError_1 = require("../../../utils/parseZodError");
const RequestParams = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class ImportChatbaseChaptersController {
    async handle(req, res) {
        const parsedParams = RequestParams.safeParse(req.params);
        if (!parsedParams.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedParams.error));
        const parsedBody = act_chatbot_1.ImportChatbaseChaptersSchema.safeParse(req.body);
        if (!parsedBody.success)
            throw new Error((0, parseZodError_1.parseZodError)(parsedBody.error));
        const service = new ActChatbotAdminService_1.ActChatbotAdminService();
        const result = await service.importChatbaseChapters({ id: parsedParams.data.id, ...parsedBody.data });
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.ImportChatbaseChaptersController = ImportChatbaseChaptersController;
