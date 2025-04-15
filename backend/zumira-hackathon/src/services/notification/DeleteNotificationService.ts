import { DeleteNotificationRequest } from "../../definitions/notification";
import prismaClient from "../../prisma";

class DeleteNotificationService {
  async execute({ notificationId }: DeleteNotificationRequest) {
    try {
      await prismaClient.notification.delete({
        where: {
          id: notificationId,
        },
      });
    } catch {
      throw new Error("Notification does not exist");
    }
  }
}

export { DeleteNotificationService };
