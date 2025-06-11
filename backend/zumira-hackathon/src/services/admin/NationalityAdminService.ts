import { CreateNationalityRequest, UpdateNationalityRequest } from "../../definitions/admin/nationality";
import prismaClient from "../../prisma";

class NationalityAdminService {
  async find(id: string) {
    return await prismaClient.nationality.findUnique({
      where: { id },
      select: {
        id: true,
        acronym: true,
        name: true,
      },
    });
  }

  async findAll() {
    const nationalities = await prismaClient.nationality.findMany({
      select: {
        id: true,
        acronym: true,
        name: true,
      },
    });

    return { items: nationalities };
  }

  async create(data: CreateNationalityRequest) {
    return await prismaClient.nationality.create({ data });
  }

  async update(data: UpdateNationalityRequest) {
    return await prismaClient.nationality.update({ where: { id: data.id }, data });
  }

  async delete(id: string) {
    return await prismaClient.nationality.delete({ where: { id } });
  }
}

export { NationalityAdminService };
