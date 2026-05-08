import { Request, Response } from "express";
import { z } from "zod";

import { CompanyAdminService } from "../../../services/admin/CompanyAdminService";
import { parseZodError } from "../../../utils/parseZodError";

const RequestParams = z.object({
  companyId: z.string().cuid(),
  actChatbotId: z.string().cuid(),
});

const RequestQuery = z.object({
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  area: z.string().optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  occupationLevel: z.string().optional(),
  skinColor: z.string().optional(),
  hasDisability: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  nationalityId: z.string().cuid().optional(),
});

class FindActAnalysisController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParams.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(error),
      });
    }

    const queryResult = RequestQuery.safeParse(req.query);

    if (!queryResult.success) {
      return res.status(400).json({
        status: "ERROR",
        message: parseZodError(queryResult.error),
      });
    }

    const companyAdminService = new CompanyAdminService();
    const analysis = await companyAdminService.findActAnalysis(
      data.companyId,
      data.actChatbotId,
      queryResult.data,
    );

    return res.json({
      status: "SUCCESS",
      data: analysis,
    });
  }
}

export { FindActAnalysisController };
