import { ReadAlertRequest } from "../../definitions/alert";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class ReadAlertService {
  async execute({ id }: ReadAlertRequest) {
    const alert = await prismaClient.alert.findFirst({
      where: {
        id,
      },

      select: {
        assessmentResult: {
          select: {
            assessment: {
              select: {
                id: true,
              },
            },
            userId: true,
          },
        },
      },
    });

    if (!alert) throw new PublicError("Alerta não existe");

    await prismaClient.alert.updateMany({
      where: {
        assessmentResult: {
          assessmentId: alert.assessmentResult.assessment.id,
          userId: alert.assessmentResult.userId,
        },
      },
      data: {
        read: true,
      },
    });

    return {};
  }
}

export { ReadAlertService };
