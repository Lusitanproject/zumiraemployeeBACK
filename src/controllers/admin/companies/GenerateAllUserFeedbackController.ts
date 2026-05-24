import { Request, Response } from "express";
import { z } from "zod";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";

const RequestParams = z.object({
  companyId: z.string().cuid(),
});

const RequestQuery = z.object({
  sync: z
    .string()
    .optional()
    .transform((v) => v !== "false")
    .default("true"),
});

class GenerateAllUserFeedbackController {
  async handle(req: Request, res: Response) {
    const data = RequestParams.parse(req.params);

    const { data: query } = RequestQuery.safeParse(req.query);
    const sync = query?.sync ?? true;

    const companyAdminService = new CompanyAdminService();
    const result = await companyAdminService.generateAllUserFeedback(data.companyId, sync);

    return res.json({
      status: "SUCCESS",
      data: result,
    });
  }
}

export { GenerateAllUserFeedbackController };
