import { ListAlertsRequest, ReadAlertRequest } from "../../schemas/alert";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class AlertService {
  async list({ userId, filter, max }: ListAlertsRequest) {
    const alerts = await prismaClient.alert.findMany({
      where: {
        assessmentResult: { userId },
        read: filter === "recent" ? undefined : false,
      },
      select: {
        id: true,
        assessmentResultRating: {
          select: {
            assessment: { select: { id: true, title: true } },
            profile: true,
            color: true,
            risk: true,
          },
        },
        read: true,
        createdAt: true,
      },
      take: max,
      orderBy: { createdAt: "desc" },
    });

    const latestAlertsMap = new Map<string, (typeof alerts)[0]>();

    for (const alert of alerts) {
      const assessmentId = alert.assessmentResultRating.assessment.id;
      const existing = latestAlertsMap.get(assessmentId);
      if (!existing || alert.createdAt > existing.createdAt) {
        latestAlertsMap.set(assessmentId, alert);
      }
    }

    return { items: Array.from(latestAlertsMap.values()) };
  }

  async read({ id }: ReadAlertRequest) {
    const alert = await prismaClient.alert.findFirst({
      where: { id },
      select: {
        assessmentResult: {
          select: {
            assessment: { select: { id: true } },
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
      data: { read: true },
    });

    return {};
  }
}

export { AlertService };
