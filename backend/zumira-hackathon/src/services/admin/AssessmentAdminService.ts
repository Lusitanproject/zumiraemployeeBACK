import { UpdateAssessment } from "../../definitions/admin/assessment";
import prismaClient from "../../prisma";

class AssessmentAdminService {
  async find(assessmentId: string) {
    const assessment = await prismaClient.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        id: true,
        title: true,
        description: true,
        summary: true,
        selfMonitoringBlockId: true,
        openaiAssistantId: true,
        operationType: true,
        nationalityId: true,
      },
    });

    return assessment;
  }
  async update({ id, ...data }: UpdateAssessment) {
    const assessment = await prismaClient.assessment.update({
      where: { id },
      data,
    });
    return assessment;
  }
}

export { AssessmentAdminService };
