import prismaClient from "../../prisma";

interface DetailAssessmentRequest {
  assessmentId: string;
}

class AssessmentDetailForAdminService {
  async execute({ assessmentId }: DetailAssessmentRequest) {
    const assessment = await prismaClient.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        title: true,
        description: true,
        summary: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true,
          },
        },
        assessmentQuestions: {
          select: {
            id: true,
            description: true,
            index: true,
            assessmentQuestionChoices: {
              select: {
                id: true,
                label: true,
                value: true,
                index: true,
              },
            },
          },
        },
        nationality: {
          select: {
            acronymn: true,
            name: true,
          },
        },
      },
    });

    if (!assessment) throw new Error("Assessment does not exist");

    return assessment;
  }
}

export { AssessmentDetailForAdminService };
