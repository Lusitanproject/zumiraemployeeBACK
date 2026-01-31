"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePsychologicalDimensionController = void 0;
const zod_1 = require("zod");
const CreatePsychologicalDimensionService_1 = require("../../services/psychological-dimension/CreatePsychologicalDimensionService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateDimensionSchema = zod_1.z.object({
    acronym: zod_1.z.string(),
    name: zod_1.z.string(),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
});
class CreatePsychologicalDimensionController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-dimension");
        const { success, data, error } = CreateDimensionSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { acronym, name, selfMonitoringBlockId } = data;
        const createDimension = new CreatePsychologicalDimensionService_1.CreatePsychologicalDimensionService();
        const dimension = await createDimension.execute({ acronym, name, selfMonitoringBlockId });
        return res.json({ status: "SUCCESS", data: dimension });
    }
}
exports.CreatePsychologicalDimensionController = CreatePsychologicalDimensionController;
