import prismaClient from "../../prisma";

class AssessmentQuestionAdminService {
  async findByAssessment(assessmentId: string) {
    const questions = await prismaClient.assessmentQuestion.findMany({
      where: { assessmentId },
      select: {
        id: true,
        index: true,
        assessmentId: true,
        description: true,
        updatedAt: true,
        psychologicalDimension: {
          select: {
            id: true,
            acronym: true,
            name: true,
          },
        },
        assessmentQuestionChoices: {
          select: {
            id: true,
            index: true,
            label: true,
            value: true,
          },
        },
      },
    });

    return questions;
  }
}

export { AssessmentQuestionAdminService };
