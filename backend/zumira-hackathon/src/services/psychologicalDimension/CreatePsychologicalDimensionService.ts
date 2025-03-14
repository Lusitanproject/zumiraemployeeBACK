import prismaClient from "../../prisma";

interface PsychologicalDimensionRequest {
    acronym: string;
    name: string;
}

class CreatePsychologicalDimensionService {
    async execute({ acronym, name }: PsychologicalDimensionRequest) {
        const dimensionExists = await prismaClient.psychologicalDimension.findFirst({
            where: {
                acronym: acronym,
                name: name,
            },
        });

        if (dimensionExists) throw new Error("Dimension already exists");

        const newDimension = await prismaClient.psychologicalDimension.create({
            data: {
                acronym,
                name,
            },
            select: {
                id: true,
                acronym: true,
                name: true,
            },
        });

        return newDimension;
    }
}

export { CreatePsychologicalDimensionService };
