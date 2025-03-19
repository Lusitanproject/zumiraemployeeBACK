import prismaClient from "../../prisma";

interface Choice {
    id?: string;
    label: string;
    value: number;
    index: number;
}

interface Question {
    id?: string;
    description: string;
    index: number;
    psychologicalDimensionId: string;
    choices: Choice[];
}

interface UpdateQuestionsRequest {
    assessmentId: string;
    questions: Question[];
}

class UpdateQuestionsService {
    async execute({ assessmentId, questions }: UpdateQuestionsRequest) {
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
            (oldChoice) => !questions.some((q) => q.choices.some((c) => oldChoice.id === c.id))
        );

        for (const question of questions) {
            if (!question.id) {
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
                for (const choice of question.choices) {
                    if (!choice.id) {
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
    }
}

export { UpdateQuestionsService };
