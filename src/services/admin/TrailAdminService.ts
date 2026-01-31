import { CreateTrailRequest, UpdateTrailRequest } from "../../definitions/admin/trail";
import prismaClient from "../../prisma";

class TrailAdminService {
  async find(id: string) {
    const trail = await prismaClient.trail.findFirst({ where: { id } });
    return trail;
  }

  async findAll() {
    const trails = await prismaClient.trail.findMany();
    return { items: trails };
  }

  async create(data: CreateTrailRequest) {
    const trail = await prismaClient.trail.create({ data });
    return trail;
  }

  async update({ id, ...data }: UpdateTrailRequest) {
    const trail = await prismaClient.trail.update({ where: { id }, data });
    return trail;
  }
}

export { TrailAdminService };
