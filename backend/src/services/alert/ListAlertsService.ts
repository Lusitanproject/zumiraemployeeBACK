import { ListAlertsRequest } from "../../definitions/alert";
import prismaClient from "../../prisma";

class ListAlertsService {
  async execute({ userId, filter, max }: ListAlertsRequest) {
    const alerts = await prismaClient.alert.findMany({
      where: {
        assessmentResult: {
          userId,
        },
        read: filter === "recent" ? undefined : false,
      },
      select: {
        id: true,
        assessmentResultRating: {
          select: {
            assessment: {
              select: {
                id: true,
                title: true,
              },
            },
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

    const latestAlerts = Array.from(latestAlertsMap.values());

    return { items: latestAlerts };
  }
}

export { ListAlertsService };
