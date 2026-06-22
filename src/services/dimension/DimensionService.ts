import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class DimensionService {
  async listByAssessment(assessmentId: string) {
    const result = await prismaClient.assessment.findUnique({
      where: { id: assessmentId },
      select: {
        selfMonitoringBlock: {
          select: {
            psychologicalDimensions: {
              select: { id: true, acronym: true, name: true },
            },
          },
        },
      },
    });

    if (!result) {
      throw new PublicError("Avaliação não existe");
    }

    return { items: result.selfMonitoringBlock?.psychologicalDimensions ?? [] };
  }
}

export { DimensionService };
