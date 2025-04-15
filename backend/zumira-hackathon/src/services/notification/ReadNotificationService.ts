import { ReadNotificationRequest } from "../../definitions/notification";
import prismaClient from "../../prisma";

class ReadNotificationService {
  async execute({ userId, notificationId }: ReadNotificationRequest) {
    try {
      await prismaClient.notificationRecipient.update({
        where: {
          userId_notificationId: {
            userId,
            notificationId,
          },
        },
        data: {
          read: true,
        },
      });
    } catch {
      throw new Error("Recipient does not exist");
    }
  }
}

export { ReadNotificationService };
