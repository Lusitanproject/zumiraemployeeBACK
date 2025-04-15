import { CreateNotificationRequest } from "../../definitions/notification";
import prismaClient from "../../prisma";

class CreateNotificationService {
  async execute({ title, summary, content, notificationTypeId, userIds }: CreateNotificationRequest) {
    const users = await prismaClient.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    const fetchedUsersIds = users.map((u) => u.id);
    for (const id of userIds) {
      if (!fetchedUsersIds.includes(id)) throw new Error("One or more users does not exist");
    }

    const notification = await prismaClient.notification.create({
      data: {
        title,
        summary,
        content,
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
}

export { CreateNotificationService };
