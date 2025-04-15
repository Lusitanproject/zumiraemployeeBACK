import { EditNotificationRequest } from "../../definitions/notification";
import prismaClient from "../../prisma";

class EditNotificationService {
  async execute({ notificationId, notificationTypeId, content, summary, title }: EditNotificationRequest) {
    try {
      const notification = await prismaClient.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          content,
          summary,
          title,
          notificationTypeId,
        },
      });

      return notification;
    } catch {
      throw new Error("Notification does not exist");
    }
  }
}

export { EditNotificationService };
