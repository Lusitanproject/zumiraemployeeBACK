import { ListNotificationsRequest } from "../../definitions/notification";
import prismaClient from "../../prisma";

class ListNotificationsService {
  async execute({ userId, filter }: ListNotificationsRequest) {
    const notifications = await prismaClient.notificationRecipient.findMany({
      where: {
        userId,
        read: filter === "recent" ? undefined : false,
      },
      select: {
        read: true,
        createdAt: true,
        notification: {
          select: {
            id: true,
            title: true,
            summary: true,
            content: true,
            actionUrl: true,
            notificationType: {
              select: {
                color: true,
                priority: true,
              },
            },
          },
        },
      },
      take: filter === "recent" ? 30 : undefined,
      orderBy: { createdAt: "desc" },
    });

    return {
      notifications: notifications.map((n) => ({
        ...n.notification,
        read: n.read,
        receivedAt: n.createdAt,
      })),
    };
  }
}

export { ListNotificationsService };
