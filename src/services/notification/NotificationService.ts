import { DetailNotificationRequest, ListNotificationsRequest, ReadNotificationRequest } from "../../schemas/notification";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class NotificationService {
  async detail({ notificationId }: DetailNotificationRequest) {
    const notification = await prismaClient.notification.findFirst({
      where: { id: notificationId },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        actionUrl: true,
        notificationType: {
          select: { id: true, name: true, color: true, priority: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!notification) throw new PublicError("Notificação não existe");

    return notification;
  }

  async list({ userId, filter, max }: ListNotificationsRequest) {
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
            notificationType: { select: { color: true, priority: true } },
          },
        },
      },
      take: max,
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

  async read({ userId, notificationId }: ReadNotificationRequest) {
    try {
      await prismaClient.notificationRecipient.update({
        where: { userId_notificationId: { userId, notificationId } },
        data: { read: true },
      });
    } catch {
      throw new PublicError("Destinatário não existe");
    }
  }
}

export { NotificationService };
