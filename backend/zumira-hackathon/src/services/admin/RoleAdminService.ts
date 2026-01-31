import prismaClient from "../../prisma";

class RoleAdminService {
  async find(roleId: string) {
    const role = await prismaClient.role.findUnique({
      where: { id: roleId },
    });
    return role;
  }

  async findAll() {
    const role = await prismaClient.role.findMany();
    return role;
  }

  async findBySlug(slug: string) {
    const role = await prismaClient.role.findUnique({
      where: { slug },
    });
    return role;
  }

  async create(slug: string) {
    const role = await prismaClient.role.create({
      data: { slug },
    });
    return role;
  }
}

export { RoleAdminService };
