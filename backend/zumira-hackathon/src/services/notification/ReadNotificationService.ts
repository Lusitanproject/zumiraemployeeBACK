import { ReadNotificationRequest } from "../../definitions/notification";
import { PublicError } from "../../error";
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
      throw new PublicError("Destinatário não existe");
    }
  }
}

export { ReadNotificationService };
