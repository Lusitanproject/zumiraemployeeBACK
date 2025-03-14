import prismaClient from "../../prisma";

class ListScalesService {
    async execute() {
        const scales = await prismaClient.assessmentScale.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return { scales };
    }
}

export { ListScalesService };
