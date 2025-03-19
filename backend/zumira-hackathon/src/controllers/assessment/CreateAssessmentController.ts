import { Request, Response } from "express";
import { z } from "zod";
import { parseZodError } from "../../utils/parseZodError";
import { CreateAssessmentService } from "../../services/assessment/CreateAssessmentService";

const CreateAssessmentSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string().optional(),
	selfMonitoringBlockId: z.string().cuid(),
});

class CreateAssessmentController {
	async handle(req: Request, res: Response) {
		const { success, data, error } = CreateAssessmentSchema.safeParse(req.body);

		if (!success) throw new Error(parseZodError(error));

		const { title, summary, description, selfMonitoringBlockId } = data;

		const createAssessment = new CreateAssessmentService();
		const assessment = await createAssessment.execute({ title, summary, description, selfMonitoringBlockId });

		return res.json({ status: "SUCCESS", data: assessment });
	}
}

export { CreateAssessmentController };
