import { PublicError } from "../../error";
import prismaClient from "../../prisma";

interface CreatePsychologicalDimensionRequest {
  acronym: string;
  name: string;
  selfMonitoringBlockId: string;
}

class PsychologicalDimensionService {
  async create({ acronym, name, selfMonitoringBlockId }: CreatePsychologicalDimensionRequest) {
    const dimensionExists = await prismaClient.psychologicalDimension.findFirst({
      where: { acronym, name },
    });

    if (dimensionExists) throw new PublicError("Dimensão já existe");

    const newDimension = await prismaClient.psychologicalDimension.create({
      data: { acronym, name, selfMonitoringBlockId },
      select: { id: true, acronym: true, name: true },
    });

    return newDimension;
  }

  async list() {
    const dimensions = await prismaClient.psychologicalDimension.findMany({
      select: { id: true, acronym: true, name: true },
    });

    return { dimensions };
  }
}

export { PsychologicalDimensionService };
