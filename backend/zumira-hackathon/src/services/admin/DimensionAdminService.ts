import { z } from "zod";
import prismaClient from "../../prisma";
import { CreateDimensionSchema } from "../../definitions/admin/dimension";

type CreateDimension = z.infer<typeof CreateDimensionSchema>

class DimensionAdminService {
  async find(dimensionId: string) {
    const dimension = await prismaClient.psychologicalDimension.findUnique({
      where: { id: dimensionId },
      select: {
        id: true,
        acronym: true,
        name: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    return dimension
  }

  async findAll() {
    const dimension = await prismaClient.psychologicalDimension.findMany({
      select: {
        id: true,
        acronym: true,
        name: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    return dimension
  }

  async findBySelfMonitoring(selfMonitoringBlockId: string) {
    const dimension = await prismaClient.psychologicalDimension.findMany({
      where: { selfMonitoringBlockId },
      select: {
        id: true,
        acronym: true,
        name: true,
        selfMonitoringBlock: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    return dimension
  }

  async create(data: CreateDimension) {
    const dimension = await prismaClient.psychologicalDimension.create({ data })
    return dimension
  }
}

export { DimensionAdminService }