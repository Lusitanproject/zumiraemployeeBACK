import prismaClient from "../../../prisma";

class ListFeedbacksService {
  async execute(userId: string) {
    const recentFeedbacks = await prismaClient.userAssessmentFeedback.groupBy({
      by: ["assessmentId"],
      where: {
        userId,
      },
      _max: {
        createdAt: true,
      },
    });

    const validFeedbacks = recentFeedbacks
      .filter(({ _max }) => _max.createdAt !== null)
      .map(({ assessmentId, _max }) => ({
        assessmentId,
        createdAt: _max.createdAt as Date,
      }));

    const feedbacks = await prismaClient.userAssessmentFeedback.findMany({
      where: {
        OR: validFeedbacks,
      },
      select: {
        id: true,
        text: true,
        assessment: {
          select: {
            title: true,
            summary: true,
            description: true,
          },
        },
      },
    });

    return { items: feedbacks };
  }
}

export { ListFeedbacksService };
