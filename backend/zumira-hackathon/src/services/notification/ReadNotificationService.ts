import { ReadNotificationRequest } from "../../definitions/notification";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

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
      throw new PublicError("Destinatário não existe");
    }
  }
}

export { ReadNotificationService };
