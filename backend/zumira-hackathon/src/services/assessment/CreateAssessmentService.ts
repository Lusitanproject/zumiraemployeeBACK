import { CreateAssessment } from "../../definitions/admin/assessment";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class CreateAssessmentService {
  async execute(data: CreateAssessment) {
    const block = await prismaClient.selfMonitoringBlock.findFirst({
      where: {
        id: data.selfMonitoringBlockId,
      },
    });

    if (!block) throw new PublicError("Bloco de auto monitoramento não existe");

    const assessment = await prismaClient.assessment.create({
      data: {
        ...data,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        description: true,
        selfMonitoringBlockId: true,
      },
    });

    return assessment;
  }
}

export { CreateAssessmentService };
