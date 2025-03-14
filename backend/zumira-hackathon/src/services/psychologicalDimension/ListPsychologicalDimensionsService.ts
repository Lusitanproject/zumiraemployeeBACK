import prismaClient from "../../prisma";

class ListPsychologicalDimensionsService {
    async execute() {
        const dimensions = await prismaClient.psychologicalDimension.findMany({
            select: {
                id: true,
                acronym: true,
                name: true,
            },
        });

        return { dimensions };
    }
}

export { ListPsychologicalDimensionsService };
