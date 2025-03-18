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
exports.CreatePsychologicalDimensionController = void 0;
const CreatePsychologicalDimensionService_1 = require("../../services/psychologicalDimension/CreatePsychologicalDimensionService");
const zod_1 = require("zod");
const parseZodError_1 = require("../../utils/parseZodError");
const assertPermissions_1 = require("../../utils/assertPermissions");
const CreateDimensionSchema = zod_1.z.object({
    acronym: zod_1.z.string(),
    name: zod_1.z.string(),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
});
class CreatePsychologicalDimensionController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, assertPermissions_1.assertPermissions)(req.user, "manage-dimension");
            const { success, data, error } = CreateDimensionSchema.safeParse(req.body);
            if (!success)
                throw new Error((0, parseZodError_1.parseZodError)(error));
            const { acronym, name, selfMonitoringBlockId } = data;
            const createDimension = new CreatePsychologicalDimensionService_1.CreatePsychologicalDimensionService();
            const dimension = yield createDimension.execute({ acronym, name, selfMonitoringBlockId });
            return res.json({ status: "SUCCESS", data: dimension });
        });
    }
}
exports.CreatePsychologicalDimensionController = CreatePsychologicalDimensionController;
