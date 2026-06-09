import { PublicError } from "../../error";
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

  async findTrail(companyId: string) {
    const company = await prismaClient.company.findUnique({
      where: { id: companyId },
      select: { trail: { select: { id: true, title: true, subtitle: true, description: true } } },
    });
    if (!company) throw new PublicError("Empresa não encontrada");
    return company.trail;
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
