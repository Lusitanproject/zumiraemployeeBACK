import prismaClient from "../prisma";

interface DimensionScore {
  dimension: { id: string; name: string; acronym: string };
  value: number;
}

interface ResultScores {
  assessmentResultId: string;
  scores: DimensionScore[];
}

export async function calculateResultScores(resultIds: string[]) {
  const results = await prismaClient.assessmentResult.findMany({
    where: {
      id: {
        in: resultIds,
      },
    },

    select: {
      id: true,
      assessment: {
        select: {
          operationType: true,
          assessmentQuestions: {
            select: {
              psychologicalDimensionId: true,
              psychologicalDimension: {
                select: {
                  id: true,
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
          assessmentQuestion: {
            select: {
              psychologicalDimensionId: true,
            },
          },
          assessmentQuestionChoice: {
            select: {
              value: true,
            },
          },
        },
      },
    },
  });

  if (!results.length) return [];

  const sample = results[0];

  const dimensionIds = [...new Set(sample.assessment.assessmentQuestions.map((q) => q.psychologicalDimensionId))];
  const dimensions = dimensionIds
    .map(
      (id) =>
        sample.assessment.assessmentQuestions.find((q) => q.psychologicalDimensionId === id)?.psychologicalDimension
    )
    .filter((o) => !!o);

  const operation = sample.assessment.operationType;

  const allScores = [] as ResultScores[];
  for (const result of results) {
    const answersByDimension = dimensionIds.map((id) => ({
      dimension: dimensions.find((d) => d.id === id)!,
      answers: result.assessmentQuestionAnswers.filter((a) => a.assessmentQuestion.psychologicalDimensionId === id),
    }));

    const dimensionScores = [] as DimensionScore[];

    for (const { dimension, answers } of answersByDimension) {
      const sum = answers.reduce((prev, curr) => prev + curr.assessmentQuestionChoice.value, 0);
      const value = operation === "SUM" ? sum : sum / answers.length;
      dimensionScores.push({ dimension, value });
    }

    allScores.push({ assessmentResultId: result.id, scores: dimensionScores });
  }

  return allScores;
}
