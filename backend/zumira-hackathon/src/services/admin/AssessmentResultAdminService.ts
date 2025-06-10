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
            name: true,
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

    const aux: Record<string, (typeof results)[0]> = {};
    for (const result of results) {
      if (!aux[result.user.id] || new Date(aux[result.user.id].createdAt) < new Date(result.createdAt)) {
        aux[result.user.id] = result;
      }
    }
    const lastResults = Object.values(aux);

    const scores = await calculateResultScores(lastResults.map((r) => r.id));

    const processedData = lastResults.map((r) => ({
      ...r,
      scores: scores.find((s) => s.assessmentResultId === r.id)?.scores,
    }));

    return { items: processedData };
  }
}

export { AssessmentResultAdminService };
