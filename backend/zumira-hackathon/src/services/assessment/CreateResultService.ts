import prismaClient from "../../prisma";
import { PublicError } from "../../error";

interface ResultRequest {
  userId: string;
  assessmentId: string;
  answers: {
    assessmentQuestionId: string;
    assessmentQuestionChoiceId: string;
  }[];
}

async function allQuestionsExist(ids: string[]) {
  const questions = await prismaClient.assessmentQuestion.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
    },
  });

  for (const id of ids) {
    if (!questions.some((q) => q.id === id)) return false;
  }

  return true;
}

async function allChoicesExist(ids: string[]) {
  const choices = await prismaClient.assessmentQuestionChoice.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
    },
  });

  for (const id of ids) {
    if (!choices.some((c) => c.id === id)) return false;
  }

  return true;
}

class CreateResultService {
  async execute({ userId, assessmentId, answers }: ResultRequest) {
    const userExists = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!userExists) throw new PublicError("Usuário não existe");

    const assessmentExists = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
    });
    if (!assessmentExists) throw new PublicError("Avaliação não existe");

    if (!allQuestionsExist(answers.map((a) => a.assessmentQuestionId))) {
      throw new PublicError("Uma ou mais perguntas não existem");
    }

    if (!allChoicesExist(answers.map((a) => a.assessmentQuestionChoiceId))) {
      throw new PublicError("Uma ou mais opções não existem");
    }

    const result = await prismaClient.assessmentResult.create({
      data: {
        userId,
        assessmentId,
      },
      select: {
        id: true,
        userId: true,
        assessmentId: true,
      },
    });

    await prismaClient.assessmentQuestionAnswer.createMany({
      data: answers.map((a) => ({
        userId: userId,
        assessmentQuestionId: a.assessmentQuestionId,
        assessmentQuestionChoiceId: a.assessmentQuestionChoiceId,
        assessmentResultId: result.id,
      })),
    });

    return result;
  }
}

export { CreateResultService };
