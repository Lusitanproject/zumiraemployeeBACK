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

  async update({ id, slug }: { id: string; slug: string }) {
    return await prismaClient.role.update({ where: { id }, data: { slug } });
  }

  async delete(id: string) {
    return await prismaClient.role.delete({ where: { id } });
  }

  async setPermissions(roleId: string, permissions: string[]) {
    await prismaClient.$transaction([
      prismaClient.rolePermission.deleteMany({ where: { roleId } }),
      prismaClient.rolePermission.createMany({
        data: permissions.map((permission) => ({ roleId, permission })),
      }),
    ]);
  }
}

export { RoleAdminService };
