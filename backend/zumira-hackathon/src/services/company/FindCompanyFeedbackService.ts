import { FindCompanyFeedbackRequest } from "../../definitions/company";
import prismaClient from "../../prisma";

class FindCompanyFeedbackService {
  async execute({ assessmentId, companyId }: FindCompanyFeedbackRequest) {
    const feedback = await prismaClient.companyAssessmentFeedback.findFirst({
      where: {
        companyId,
        assessmentId,
      },
      select: {
        text: true,
        respondents: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return feedback;
  }
}

export { FindCompanyFeedbackService };
