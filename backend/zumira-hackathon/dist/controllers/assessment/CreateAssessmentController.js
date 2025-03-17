"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssessmentController = void 0;
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateAssessmentService_1 = require("../../services/assessment/CreateAssessmentService");
const CreateAssessmentSchema = zod_1.z.object({
    title: zod_1.z.string(),
    summary: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    selfMonitoringBlockId: zod_1.z.string().uuid(),
});
class CreateAssessmentController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { success, data, error } = CreateAssessmentSchema.safeParse(req.body);
            if (!success)
                throw new Error((0, parseZodError_1.parseZodError)(error));
            const { title, summary, description, selfMonitoringBlockId } = data;
            const createAssessment = new CreateAssessmentService_1.CreateAssessmentService();
            const assessment = yield createAssessment.execute({ title, summary, description, selfMonitoringBlockId });
            return res.json({ status: "SUCCESS", data: assessment });
        });
    }
}
exports.CreateAssessmentController = CreateAssessmentController;
