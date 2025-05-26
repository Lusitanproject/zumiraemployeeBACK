import { FindFilteredAlertsRequest } from "../../definitions/admin/assessment";
import prismaClient from "../../prisma";
import { calculateResultScores } from "../../utils/calculateResultScores";

class AssessmentResultAdminService {
  async findFiltered({ assessmentId, companyId }: FindFilteredAlertsRequest) {
    const results = await prismaClient.assessmentResult.findMany({
      where: {
        assessmentId,
        user: {
          companyId,
        },
        feedback: {
          not: null,
        },
        assessmentResultRatingId: {
          not: null,
        },
      },

      select: {
        id: true,
        user: {
          select: {
            id: true,
            email: true,
            companyId: true,
          },
        },
        assessmentResultRating: {
          select: {
            risk: true,
            profile: true,
            color: true,
          },
        },
        createdAt: true,
      },
    });

    const scores = await calculateResultScores(results.map((r) => r.id));

    const processedData = results.map((r) => ({
      ...r,
      scores: scores.find((s) => s.assessmentResultId === r.id)?.scores,
    }));

    return { items: processedData };
  }
}

export { AssessmentResultAdminService };
