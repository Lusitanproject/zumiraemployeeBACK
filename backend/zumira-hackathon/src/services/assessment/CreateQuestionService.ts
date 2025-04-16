import prismaClient from "../../prisma";

interface QuestionRequest {
  description: string;
  index: number;
  assessmentId: string;
  psychologicalDimensionId: string;
  choices: {
    label: string;
    value: number;
    index: number;
  }[];
}

class CreateQuestionService {
  async execute({ description, assessmentId, index, psychologicalDimensionId, choices }: QuestionRequest) {
    const assessmentExists = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
    });

    if (!assessmentExists) throw new Error("Assessment does not exist");

    const dimensionExists = await prismaClient.psychologicalDimension.findFirst({
      where: {
        id: psychologicalDimensionId,
      },
    });

    if (!dimensionExists) throw new Error("Psychological dimension does not exist");

    const question = await prismaClient.assessmentQuestion.create({
      data: {
        description,
        index,
        assessmentId,
        psychologicalDimensionId,
      },
      select: {
        id: true,
        description: true,
        assessmentId: true,
        psychologicalDimensionId: true,
      },
    });

    await prismaClient.assessmentQuestionChoice.createMany({
      data: choices.map((c) => ({
        label: c.label,
        value: c.value,
        index: c.index,
        assessmentQuestionId: question.id,
      })),
    });

    return question;
  }
}

export { CreateQuestionService };
