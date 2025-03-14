import { Request, Response } from "express";
import { ListAssessmentsService } from "../../services/assessment/ListAssessmentsService";

class ListAssessmentsController {
    async handle(req: Request, res: Response) {
        const userId = req.user.id;

        const listAssessments = new ListAssessmentsService();
        const assessments = await listAssessments.execute(userId);

        return res.json({ status: "SUCCESS", data: assessments });
    }
}

export { ListAssessmentsController };
