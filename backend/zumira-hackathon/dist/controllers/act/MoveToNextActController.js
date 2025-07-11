"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveToNextActController = void 0;
const MoveToNextActService_1 = require("../../services/act/MoveToNextActService");
class MoveToNextActController {
    async handle(req, res) {
        const service = new MoveToNextActService_1.MoveToNextActService();
        const result = await service.execute(req.user.id);
        return res.json({ status: "SUCCESS", data: result });
    }
}
exports.MoveToNextActController = MoveToNextActController;
