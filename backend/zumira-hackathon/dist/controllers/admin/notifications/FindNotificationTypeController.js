"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindNotificationTypeController = void 0;
const parseZodError_1 = require("../../../utils/parseZodError");
const zod_1 = require("zod");
const NotificationTypeAdminService_1 = require("../../../services/admin/NotificationTypeAdminService");
const RequestParam = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
class FindNotificationTypeController {
    async handle(req, res) {
        const { success, data, error } = RequestParam.safeParse(req.params);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const service = new NotificationTypeAdminService_1.NotificationTypeAdminService();
        const notification = await service.find(data.id);
        return res.json({ status: "SUCCESS", data: notification });
    }
}
exports.FindNotificationTypeController = FindNotificationTypeController;
