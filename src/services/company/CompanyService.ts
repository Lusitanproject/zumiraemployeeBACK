import prismaClient from "../../prisma";
import { FindCompanyFeedbackRequest } from "../../schemas/company";

class CompanyService {
  async findFeedback({ assessmentId, companyId }: FindCompanyFeedbackRequest) {
    const feedback = await prismaClient.companyAssessmentAnalysis.findFirst({
      where: { companyId, assessmentId },
      select: { text: true, respondents: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return feedback;
  }

  async find(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
      include: {
        companyAvailableAssessments: {
          select: { assessmentId: true },
        },
      },
    });

    return company;
  }
}

export { CompanyService };
