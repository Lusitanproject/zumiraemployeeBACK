import { PublicError } from "../../error";
import prismaClient from "../../prisma";

interface QuestionRequest {
  assessmentId: string;
  choices: {
    label: string;
    value: number;
    index: number;
  }[];
  description: string;
  index: number;
  psychologicalDimensionId: string;
}

class CreateQuestionService {
  async execute({ description, assessmentId, index, psychologicalDimensionId, choices }: QuestionRequest) {
    const assessmentExists = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
    });

    if (!assessmentExists) throw new PublicError("Avaliação não existe");

    const dimensionExists = await prismaClient.psychologicalDimension.findFirst({
      where: {
        id: psychologicalDimensionId,
      },
    });

    if (!dimensionExists) throw new PublicError("Dimensão psicológica não existe");

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
