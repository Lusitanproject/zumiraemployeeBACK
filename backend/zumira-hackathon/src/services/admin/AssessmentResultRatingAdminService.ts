import equal from "fast-deep-equal";

import { UpdateRatingsRequest } from "../../definitions/admin/assessment";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class AssessmentResultRatingAdminService {
  async findByAssessment(assessmentId: string) {
    const ratings = await prismaClient.assessmentResultRating.findMany({
      where: { assessmentId },
      select: {
        id: true,
        risk: true,
        profile: true,
        color: true,
      },
    });

    return { items: ratings };
  }

  async updateAssessmentResultRatings(data: UpdateRatingsRequest) {
    const assessment = await prismaClient.assessment.findFirst({
      where: { id: data.assessmentId },
      include: { assessmentResultRatings: true },
    });
    if (!assessment) throw new PublicError("Avaliação não existe");

    const newRatings = data.ratings.filter((r) => !r.id);
    const deletedRatings = assessment.assessmentResultRatings.filter(
      (r1) => !data.ratings.some((r2) => r1.id === r2.id)
    );
    const updatedRatings = data.ratings.filter((r1) => {
      if (!r1.id) return false;

      const r2 = assessment.assessmentResultRatings.find((r2) => r1.id === r2.id);
      return r2 && !equal(r1, r2);
    });

    await Promise.all([
      prismaClient.assessmentResultRating.createMany({
        data: newRatings.map((r) => ({
          risk: r.risk,
          profile: r.profile,
          color: r.color,
          assessmentId: data.assessmentId,
        })),
      }),

      prismaClient.assessmentResultRating.deleteMany({
        where: {
          id: {
            in: deletedRatings.map((r) => r.id!),
          },
        },
      }),

      ...updatedRatings.map((r) =>
        prismaClient.assessmentResultRating.update({
          where: {
            id: r.id,
          },
          data: { risk: r.risk, profile: r.profile, color: r.color },
        })
      ),
    ]);

    return {};
  }
}

export { AssessmentResultRatingAdminService };
