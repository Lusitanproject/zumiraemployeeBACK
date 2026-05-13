import prismaClient from "../../prisma";

class PsychosocialFactorService {
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
}

export { PsychosocialFactorService };
