import { DetailResultRequest } from "../../definitions/assessment";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

class DetailResultService {
  async execute({ userId, assessmentId }: DetailResultRequest) {
    const result = await prismaClient.assessmentResult.findFirst({
      where: {
        userId,
        assessmentId,
      },

      select: {
        id: true,
        feedback: true,
        assessmentResultRating: {
          select: {
            risk: true,
            profile: true,
            color: true,
          },
        },
        assessment: {
          select: {
            id: true,
            title: true,
            summary: true,
            description: true,
            nationality: {
              select: {
                name: true,
                acronymn: true,
              },
            },
            selfMonitoringBlock: {
              select: {
                id: true,
                icon: true,
                title: true,
                summary: true,
                psychologicalDimensions: {
                  select: {
                    acronym: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        assessmentQuestionAnswers: {
          select: {
            assessmentQuestionChoice: {
              select: {
                label: true,
                value: true,
                index: true,
              },
            },
            assessmentQuestion: {
              select: {
                description: true,
                index: true,
                psychologicalDimension: {
                  select: {
                    name: true,
                    acronym: true,
                  },
                },
              },
            },
          },
        },
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    if (!result) throw new PublicError("Nenhum resultado para esta avaliação");

    const dimensions: Record<
      string,
      (typeof result.assessmentQuestionAnswers)[0]["assessmentQuestion"]["psychologicalDimension"]
    > = {};

    result.assessmentQuestionAnswers.forEach((q) => {
      const dimension = q.assessmentQuestion.psychologicalDimension;
      const id = dimension.acronym + dimension.name;
      dimensions[id] = dimension;
    });

    return { ...result, psychologicalDimensions: Object.values(dimensions) };
  }
}

export { DetailResultService };
