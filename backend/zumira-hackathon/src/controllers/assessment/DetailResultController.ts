import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { DetailResultService } from "../../services/assessment/DetailResultService";

const RequestParamSchema = z.object({
  id: z.string().cuid(),
});

class DetailResultController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = RequestParamSchema.safeParse(req.params);
    if (!success) throw new Error(parseZodError(error));

    const { id: assessmentId } = data;
    const userId = req.user.id;

    const service = new DetailResultService();
    const result = await service.execute({ userId, assessmentId });

    return res.json({ status: "SUCCESS", data: result });
  }
}

export { DetailResultController };
