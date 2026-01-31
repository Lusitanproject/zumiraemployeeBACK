import { z } from "zod";

import {
  CreateSelfMonitoringBlockSchema,
  EditSelfMonitoringBlockSchema,
} from "../../definitions/admin/self-monitoring";
import prismaClient from "../../prisma";

type CreateBlock = z.infer<typeof CreateSelfMonitoringBlockSchema>;
type UpdateBlock = z.infer<typeof EditSelfMonitoringBlockSchema>;

class SelfMonitoringAdminService {
  async find(id: string) {
    const user = await prismaClient.selfMonitoringBlock.findUnique({
      where: { id },
    });
    return user;
  }

  async findAll() {
    const users = await prismaClient.selfMonitoringBlock.findMany();
    return users;
  }

  async create(data: CreateBlock) {
    const user = await prismaClient.selfMonitoringBlock.create({ data });
    return user;
  }

  async update({ id, ...data }: UpdateBlock & { id: string }) {
    const user = await prismaClient.selfMonitoringBlock.update({
      where: { id },
      data,
    });
    return user;
  }
}

export { SelfMonitoringAdminService };
