import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
  UpdateNotificationRequest,
} from "../../definitions/notification";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

class NotificationAdminService {
  async findAll() {
    const notifications = await prismaClient.notification.findMany({
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
            priority: true,
            color: true,
          },
        },
      },
    });

    return { notifications };
  }

  async findByType(notificationTypeId: string) {
    const notifications = await prismaClient.notification.findMany({
      where: { notificationTypeId },
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
            priority: true,
            color: true,
          },
        },
      },
    });

    return { notifications };
  }

  async create({ title, summary, content, notificationTypeId, actionUrl, userIds }: CreateNotificationRequest) {
    const users = await prismaClient.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    const fetchedUsersIds = users.map((u) => u.id);
    for (const id of userIds) {
      if (!fetchedUsersIds.includes(id)) throw new PublicError("Um ou mais usuários não existem");
    }

    const notification = await prismaClient.notification.create({
      data: {
        title,
        summary,
        content,
        actionUrl,
        notificationTypeId,
      },
    });

    await prismaClient.notificationRecipient.createMany({
      data: userIds.map((userId) => ({
        userId,
        notificationId: notification.id,
      })),
    });

    return notification;
  }

  async update({ notificationId, title, summary, content, notificationTypeId, actionUrl }: UpdateNotificationRequest) {
    try {
      const notification = await prismaClient.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          title,
          summary,
          content,
          actionUrl,
          notificationTypeId,
        },
      });

      return notification;
    } catch {
      throw new PublicError("Notificação não existe");
    }
  }

  async delete({ notificationId }: DeleteNotificationRequest) {
    try {
      await prismaClient.notification.delete({
        where: {
          id: notificationId,
        },
      });
    } catch {
      throw new PublicError("Notificação não existe");
    }
  }
}

export { NotificationAdminService };
