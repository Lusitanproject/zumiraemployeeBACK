import { Request, Response } from "express";
import { z } from "zod";

import { CompanyService } from "../../services/company/CompanyService";
import { parseZodError } from "../../utils/parseZodError";

const RequestParam = z.object({
  companyId: z.string().cuid(),
});

class FindCompanyController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params);

    if (!success) {
      return res.status(400).json({ status: "ERROR", message: parseZodError(error) });
    }

    const companyService = new CompanyService();
    const company = await companyService.find(data.companyId);

    if (!company) {
      return res.status(400).json({ status: "ERROR", message: "Empresa não encontrada." });
    }

    return res.json({ status: "SUCCESS", data: company });
  }
}

export { FindCompanyController };
