import { Request, Response } from "express";
import { z } from "zod";

import { parseZodError } from "../../../utils/parseZodError";
import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

const RequestParam = z.object({
  companyId: z.string().cuid(),
});

class FindCompanyController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParam.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const companyAdminService = new CompanyAdminService();
    const company = await companyAdminService.find(data.companyId);

    if (!company) {
      return res.status(400).json({
        status: "ERROR",
        message: "Empresa não encontrada não encontrado.",
      });
    }

    return res.json({ status: "SUCCESS", data: company });
  }
}

export { FindCompanyController };
