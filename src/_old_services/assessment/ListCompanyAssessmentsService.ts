import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class ListCompanyAssessmentsService {
  async execute(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        companyId: true,
      },
    });

    if (!user) throw new PublicError("Usuário não existe");
    if (!user.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    return this.findAssessmentsByCompanyAndUser(user.companyId, userId);
  }

  private async findAssessmentsByCompanyAndUser(companyId: string, userId: string) {
    const assessments = await prismaClient.assessment.findMany({
      where: {
        companyAvailableAssessments: {
          some: {
            companyId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        summary: true,
        public: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true,
          },
        },
        assessmentResults: {
          where: {
            userId,
          },
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    const formattedAssessments = assessments.map((a) => {
      const hasResults = a.assessmentResults.length > 0;

      return {
        id: a.id,
        title: a.title,
        summary: a.summary,
        public: a.public,
        selfMonitoring: a.selfMonitoringBlock,
        lastCompleted: hasResults
          ? new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime())))
          : null,
      };
    });

    return { assessments: formattedAssessments };
  }
}

export { ListCompanyAssessmentsService };
