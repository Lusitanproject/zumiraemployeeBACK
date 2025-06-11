"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyController = void 0;
const zod_1 = require("zod");
const CreateCompanyService_1 = require("../../services/company/CreateCompanyService");
const assertPermissions_1 = require("../../utils/assertPermissions");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateCompanySchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
});
class CreateCompanyController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-company");
        const { success, data, error } = CreateCompanySchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { name, email } = data;
        const createCompany = new CreateCompanyService_1.CreateCompanyService();
        const company = await createCompany.execute({ name, email });
        return res.json({ status: "SUCCESS", data: company });
    }
}
exports.CreateCompanyController = CreateCompanyController;
