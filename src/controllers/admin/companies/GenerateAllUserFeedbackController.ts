import { Request, Response } from "express";
import { z } from "zod";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({
  companyId: z.string().cuid(),
});

class GenerateAllUserFeedbackController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParams.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const companyAdminService = new CompanyAdminService();
    const result = await companyAdminService.generateAllUserFeedback(data.companyId);

    return res.json({
      status: "SUCCESS",
      data: result,
    });
  }
}

export { GenerateAllUserFeedbackController };
