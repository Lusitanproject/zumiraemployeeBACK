import { Request, Response } from "express";

import { PublicError } from "../../error";
import { CompanyService } from "../../services/company/CompanyService";

class GetCompanyTrailController {
  async handle(req: Request, res: Response) {
    if (!req.user.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    const result = await new CompanyService().findTrail(req.user.companyId);
    return res.json({ status: "SUCCESS", data: result });
  }
}

export { GetCompanyTrailController };
