import { Request, Response } from "express";
import { z } from "zod";
import { assertPermissions } from "../../utils/assertPermissions";
import { parseZodError } from "../../utils/parseZodError";
import { CreateCompanyService } from "../../services/company/CreateCompanyService";

const CreateCompanySchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

class CreateCompanyController {
  async handle(req: Request, res: Response) {
    assertPermissions(req.user, "manage-company");

    const { success, data, error } = CreateCompanySchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const { name, email } = data;

    const createCompany = new CreateCompanyService();
    const company = await createCompany.execute({ name, email });

    return res.json({ status: "SUCCESS", data: company });
  }
}

export { CreateCompanyController };
