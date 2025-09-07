import { ListAssessmentsRequest } from "../../definitions/assessment";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
class ListAssessmentsService {
  async execute({ userId, nationalityId }: ListAssessmentsRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new PublicError("Usuário não existe");

    const assessments = await prismaClient.assessment.findMany({
      where: {
        nationalityId, // Ignorado se for undefined
        public: true,
        companyAvailableAssessments: user.companyId
          ? {
              some: {
                companyId: user.companyId,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true,
          },
        },
        assessmentResults: {
          where: {
            userId: userId,
          },
          select: {
            createdAt: true,
          },
        },
      },
    });

    const formattedAssessments = assessments.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      selfMonitoring: a.selfMonitoringBlock,
      lastCompleted: new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
    }));

    return { assessments: formattedAssessments };
  }
}

export { ListAssessmentsService };
