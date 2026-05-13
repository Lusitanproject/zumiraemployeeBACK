import prismaClient from "../../prisma";

class ListResultsService {
  async execute(userId: string) {
    const results = await prismaClient.assessmentResult.findMany({
      where: {
        userId,
      },

      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            summary: true,
          },
        },
      },
    });

    const latestResults: Record<string, (typeof results)[0]> = {};
    results.forEach((r) => {
      if (!latestResults[r.assessment.id] || latestResults[r.assessment.id].createdAt < r.createdAt) {
        latestResults[r.assessment.id] = r;
      }
    });

    return { items: Object.values(latestResults) };
  }
}

export { ListResultsService };
