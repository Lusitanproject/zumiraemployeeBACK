import prismaClient from "../../prisma";

interface Choice {
  index: number;
  label: string;
  value: number;
  id?: string;
}

interface Question {
  choices: Choice[];
  description: string;
  index: number;
  psychologicalDimensionId: string;
  id?: string;
}

interface UpdateQuestionsRequest {
  assessmentId: string;
  questions: Question[];
}

class UpdateQuestionsService {
  async execute({ assessmentId, questions }: UpdateQuestionsRequest) {
    const startTime = new Date();

    const oldQuestions = await prismaClient.assessmentQuestion.findMany({
      where: {
        assessmentId,
      },
      include: {
        assessmentQuestionChoices: true,
      },
    });
    const oldChoices = oldQuestions.map((q) => q.assessmentQuestionChoices.map((c) => c)).flat();

    const deletedQuestions = oldQuestions.filter((oldQuestion) => !questions.some((q) => oldQuestion.id === q.id));
    const deletedChoices = oldChoices.filter(
      (oldChoice) => !questions.some((q) => q.choices.some((c) => oldChoice.id === c.id)),
    );

    for (const question of questions) {
      if (!question.id) {
        // Create new question and choices
        const createdQuestion = await prismaClient.assessmentQuestion.create({
          data: {
            assessmentId: assessmentId,
            description: question.description,
            index: question.index,
            psychologicalDimensionId: question.psychologicalDimensionId,
          },
          select: {
            id: true,
            description: true,
            index: true,
            assessmentId: true,
            psychologicalDimensionId: true,
          },
        });

        await prismaClient.assessmentQuestionChoice.createManyAndReturn({
          data: question.choices.map((c) => ({
            label: c.label,
            value: c.value,
            index: c.index,
            assessmentQuestionId: createdQuestion.id,
          })),
        });
      } else {
        // Update existing question

        const storedQuestion = oldQuestions.find((q) => q.id === question.id);
        const updated =
          storedQuestion?.description !== question.description ||
          storedQuestion.index !== question.index ||
          storedQuestion.psychologicalDimensionId !== question.psychologicalDimensionId;

        if (updated) {
          await prismaClient.assessmentQuestion.update({
            where: {
              id: question.id,
            },
            data: {
              description: question.description,
              index: question.index,
              psychologicalDimensionId: question.psychologicalDimensionId,
            },
          });
        }

        for (const choice of question.choices) {
          if (!choice.id) {
            // Create new choices
            await prismaClient.assessmentQuestionChoice.create({
              data: {
                index: choice.index,
                label: choice.label,
                value: choice.value,
                assessmentQuestionId: question.id,
              },
              select: {
                id: true,
                label: true,
                value: true,
                index: true,
                assessmentQuestionId: true,
              },
            });
          } else {
            // Update existing choice
            const storedChoice = oldChoices.find((c) => c.id === choice.id);
            const updated =
              storedChoice?.index !== choice.index ||
              storedChoice.label !== choice.label ||
              storedChoice.value !== choice.value;

            if (updated) {
              await prismaClient.assessmentQuestionChoice.update({
                where: {
                  id: choice.id,
                },
                data: {
                  index: choice.index,
                  label: choice.label,
                  value: choice.value,
                },
              });
            }
          }
        }
      }
    }

    await prismaClient.assessmentQuestion.deleteMany({
      where: {
        id: {
          in: deletedQuestions.map((q) => q.id).filter((id) => id !== undefined),
        },
      },
    });
    await prismaClient.assessmentQuestionChoice.deleteMany({
      where: {
        id: {
          in: deletedChoices.map((c) => c.id).filter((id) => id !== undefined),
        },
      },
    });

    const endTime = new Date();
    const timeDiffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`Updated assessment ${assessmentId} questions in ${timeDiffInSeconds} seconds`);
  }
}

export { UpdateQuestionsService };
