import {
  CreatePsychosocialFactorRequest,
  UpdatePsychosocialFactorRequest,
} from "../../definitions/admin/psychosocial-factor";
import prismaClient from "../../prisma";

class PsychosocialFactorAdminService {
  async find(id: string) {
    return await prismaClient.psychosocialFactor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        wheight: true,
        description: true,
        selfMonitoringBlockId: true,
      },
    });
  }

  async findAll() {
    const factors = await prismaClient.psychosocialFactor.findMany({
      select: {
        id: true,
        name: true,
        wheight: true,
        description: true,
        selfMonitoringBlockId: true,
      },
    });

    return { items: factors };
  }

  async create(data: CreatePsychosocialFactorRequest) {
    return await prismaClient.psychosocialFactor.create({
      data,
      select: {
        id: true,
        name: true,
        wheight: true,
        description: true,
        selfMonitoringBlockId: true,
      },
    });
  }

  async update(data: UpdatePsychosocialFactorRequest) {
    const { id, ...updateData } = data;
    return await prismaClient.psychosocialFactor.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        wheight: true,
        description: true,
        selfMonitoringBlockId: true,
      },
    });
  }

  async delete(id: string) {
    return await prismaClient.psychosocialFactor.delete({
      where: { id },
      select: {
        id: true,
      },
    });
  }
}

export { PsychosocialFactorAdminService };
