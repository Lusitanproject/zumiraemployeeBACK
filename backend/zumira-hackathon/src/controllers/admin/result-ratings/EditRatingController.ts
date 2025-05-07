import { Request, Response } from "express";
import { EditResultRatingSchema } from "../../../definitions/admin/result-rating";
import { parseZodError } from "../../../utils/parseZodError";
import { ResultRatingAdminService } from "../../../services/admin/ResultRatingAdminService";

class EditRatingController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = EditResultRatingSchema.safeParse({ ...req.body, ...req.params });

    if (!success) throw new Error(parseZodError(error));

    const service = new ResultRatingAdminService();
    const result = await service.edit(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { EditRatingController };
