import prismaClient from "../../prisma";
import { PublicError } from "../../error";

interface PsychologicalDimensionRequest {
  acronym: string;
  name: string;
  selfMonitoringBlockId: string;
}

class CreatePsychologicalDimensionService {
  async execute({ acronym, name, selfMonitoringBlockId }: PsychologicalDimensionRequest) {
    const dimensionExists = await prismaClient.psychologicalDimension.findFirst({
      where: {
        acronym: acronym,
        name: name,
      },
    });

    if (dimensionExists) throw new PublicError("Dimensão já existe");

    const newDimension = await prismaClient.psychologicalDimension.create({
      data: {
        acronym,
        name,
        selfMonitoringBlockId,
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
