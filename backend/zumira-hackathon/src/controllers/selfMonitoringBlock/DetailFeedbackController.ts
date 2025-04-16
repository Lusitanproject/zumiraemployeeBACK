import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { DetailFeedbackService } from "../../services/selfMonitoringBlock/DetailFeedbackService";

const DetailFeedbackSchema = z.object({
  id: z.string().cuid(),
});

class DetailFeedbackController {
  async handle(req: Request, res: Response) {
    const { success, data, error } = DetailFeedbackSchema.safeParse(req.params);

    if (!success) throw new Error(parseZodError(error));

    const { id: selfMonitoringBlockId } = data;
    const userId = req.user.id;

    const detailFeedback = new DetailFeedbackService();
    const feedback = await detailFeedback.execute({ userId, selfMonitoringBlockId });

    return res.json({ status: "SUCCESS", data: feedback });
  }
}

export { DetailFeedbackController };
