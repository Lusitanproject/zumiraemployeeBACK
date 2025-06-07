import prismaClient from "../../prisma";
import { PublicError } from "../../error";

interface DetailAssessmentRequest {
  userId: string;
  assessmentId: string;
}

class DetailAssessmentService {
  async execute({ userId, assessmentId }: DetailAssessmentRequest) {
    const assessment = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        summary: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true,
            summary: true,
            icon: true,
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
        assessmentResults: {
          where: {
            userId: userId,
          },
          select: {
            createdAt: true,
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

    if (!assessment) throw new PublicError("Avaliação não existe");

    const formattedAssesment = {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      assessmensQuestions: assessment.assessmentQuestions,
      selfMonitoringBlock: assessment.selfMonitoringBlock,
      nationality: assessment.nationality,
      lastCompleted: new Date(Math.max(...assessment.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
    };

    return formattedAssesment;
  }
}

export { DetailAssessmentService };
