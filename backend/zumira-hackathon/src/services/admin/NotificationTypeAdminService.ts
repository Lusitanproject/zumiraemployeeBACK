import prismaClient from "../../prisma";

class NotificationTypeAdminService {
  async find(notificationTypeId: string) {
    const type = await prismaClient.notificationType.findUnique({
      where: { id: notificationTypeId },
      select: {
        id: true,
        name: true,
        priority: true,
        color: true,
      },
    });

    return type;
  }

  async findAll() {
    const types = await prismaClient.notificationType.findMany({
      select: {
        id: true,
        name: true,
        priority: true,
        color: true,
      },
    });
    return { types };
  }
}

export { NotificationTypeAdminService };
