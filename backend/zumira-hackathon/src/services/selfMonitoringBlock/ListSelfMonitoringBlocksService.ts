import prismaClient from "../../prisma";

class ListSelfMonitoringBlocksService {
  async execute() {
    const blocks = await prismaClient.selfMonitoringBlock.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        icon: true
      },
    });

    return { blocks };
  }
}

export { ListSelfMonitoringBlocksService };
