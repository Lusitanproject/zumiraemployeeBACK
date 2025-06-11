import { DetailNotificationRequest } from "../../definitions/notification";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class DetailNotificationService {
  async execute({ notificationId }: DetailNotificationRequest) {
    const notification = await prismaClient.notification.findFirst({
      where: {
        id: notificationId,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        actionUrl: true,
        notificationType: {
          select: {
            id: true,
            name: true,
            color: true,
            priority: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!notification) throw new PublicError("Notificação não existe");

    return notification;
  }
}

export { DetailNotificationService };
