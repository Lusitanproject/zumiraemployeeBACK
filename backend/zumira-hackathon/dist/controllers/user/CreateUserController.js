"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const zod_1 = require("zod");
const assertPermissions_1 = require("../../utils/assertPermissions");
const parseZodError_1 = require("../../utils/parseZodError");
const CreateUserService_1 = require("../../services/user/CreateUserService");
const CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    role: zod_1.z.enum(["user", "company", "admin"]),
    companyId: zod_1.z.string().cuid().optional(),
});
class CreateUserController {
    async handle(req, res) {
        (0, assertPermissions_1.assertPermissions)(req.user, "manage-users");
        const { success, data, error } = CreateUserSchema.safeParse(req.body);
        if (!success)
            throw new Error((0, parseZodError_1.parseZodError)(error));
        const { name, email, role, companyId } = data;
        if (role === "admin" && req.user.role !== "admin")
            throw new Error("Only admins can create new admin users");
        const createUser = new CreateUserService_1.CreateUserService();
        const user = await createUser.execute({ name, email, role, companyId });
        return res.json({ status: "SUCCESS", data: user });
    }
}
exports.CreateUserController = CreateUserController;
