import prismaClient from "../../prisma";

interface QuestionRequest {
    description: string;
    assessmentId: string;
    psychologicalDimensionId: string;
    choices: {
        label: string;
        value: number;
    }[];
}

class CreateQuestionService {
    async execute({ description, assessmentId, psychologicalDimensionId, choices }: QuestionRequest) {
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
                assessmentQuestionId: question.id,
            })),
        });

        return question;
    }
}

export { CreateQuestionService };
