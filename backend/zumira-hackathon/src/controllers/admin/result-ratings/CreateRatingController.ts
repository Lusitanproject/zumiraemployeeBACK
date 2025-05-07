import { Request, Response } from "express";
import { CreateResultRatingSchema } from "../../../definitions/admin/result-rating";
import { parseZodError } from "../../../utils/parseZodError";
import { ResultRatingAdminService } from "../../../services/admin/ResultRatingAdminService";

class CreateRatingController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = CreateResultRatingSchema.safeParse(req.body);

    if (!success) throw new Error(parseZodError(error));

    const service = new ResultRatingAdminService();
    const result = await service.create(data);

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { CreateRatingController };
