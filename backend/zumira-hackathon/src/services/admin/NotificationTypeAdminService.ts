import { CreateNotificationTypeRequest, UpdateNotificationTypeRequest } from "../../definitions/admin/notification";
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
    return { items: types };
  }

  async create(data: CreateNotificationTypeRequest) {
    const type = await prismaClient.notificationType.create({ data });
    return type;
  }

  async update(data: UpdateNotificationTypeRequest) {
    const type = await prismaClient.notificationType.update({ where: { id: data.id }, data });
    return type;
  }
}

export { NotificationTypeAdminService };
