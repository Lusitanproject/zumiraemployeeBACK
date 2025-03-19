import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { UpdateFeedbackService } from "../../services/selfMonitoringBlock/UpdateFeedbackService";

const UpdateFeedbackSchema = z.object({
    id: z.string().cuid(),
});

class UpdateFeedbackController {
    async handle(req: Request, res: Response) {
        const { success, data, error } = UpdateFeedbackSchema.safeParse(req.params);

        if (!success) throw new Error(parseZodError(error));

        const { id: selfMonitoringBlockId } = data;
        const userId = req.user.id;

        const updateFeedback = new UpdateFeedbackService();
        const feedback = await updateFeedback.execute({ userId, selfMonitoringBlockId });

        return res.json({ status: "SUCCESS", data: feedback });
    }
}

export { UpdateFeedbackController };
