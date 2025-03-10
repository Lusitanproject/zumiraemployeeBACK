import prismaClient from "../../prisma";

class ListSelfMonitoringBlocksService {
    async execute() {
        const blocks = await prismaClient.selfMonitoringBlock.findMany({
            select: {
                id: true,
                title: true,
            },
        });

        return { blocks };
    }
}

export { ListSelfMonitoringBlocksService };
