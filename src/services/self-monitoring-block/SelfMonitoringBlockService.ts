import prismaClient from "../../prisma";
import { ListSelfMonitoringBlockResultsRequest } from "../../schemas/selfMonitoringBlock";

class SelfMonitoringBlockService {
  async list() {
    const blocks = await prismaClient.selfMonitoringBlock.findMany({
      select: { id: true, title: true, summary: true, icon: true },
      where: { assessments: { some: {} } },
    });

    return { blocks };
  }

  async listResults({ userId, selfMonitoringBlockId }: ListSelfMonitoringBlockResultsRequest) {
    const results = await prismaClient.assessmentResult.findMany({
      where: { userId, assessment: { selfMonitoringBlockId } },
      include: {
        assessment: {
          include: {
            assessmentQuestions: { include: { psychologicalDimension: true } },
          },
        },
        assessmentResultRating: { select: { risk: true } },
      },
    });

    const latestResults: Record<string, (typeof results)[0]> = {};
    results.forEach((r) => {
      if (!latestResults[r.assessment.id] || latestResults[r.assessment.id].createdAt < r.createdAt) {
        latestResults[r.assessment.id] = r;
      }
    });

    const formattedResults = Object.values(latestResults).map((r) => {
      const psychologicalDimensions = [
        ...new Set(r.assessment.assessmentQuestions.map((q) => q.psychologicalDimension.name)),
      ];

      return {
        id: r.id,
        feedback: r.feedback,
        assessmentResultRating: r.assessmentResultRating,
        assessment: {
          id: r.assessment.id,
          title: r.assessment.title,
          summary: r.assessment.summary,
          psychologicalDimensions,
        },
        answeredAt: r.createdAt,
      };
    });

    return { items: formattedResults };
  }
}

export { SelfMonitoringBlockService };
