import { Request, Response } from "express";
import { z } from "zod";
import { assertPermissions } from "../../utils/assertPermissions";
import { parseZodError } from "../../utils/parseZodError";
import { CreateUserService } from "../../services/user/CreateUserService";

const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["user", "company", "admin"] as const),
  companyId: z.string().cuid().optional(),
});

class CreateUserController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-users");

    const { success, data, error } = CreateUserSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const { name, email, role, companyId } = data;

    if (role === "admin" && req.user.role !== "admin") throw new Error("Only admins can create new admin users");

    const createUser = new CreateUserService();
    const user = await createUser.execute({ name, email, role, companyId });

    return res.json({ status: "SUCCESS", data: user });
  }
}

export { CreateUserController };
