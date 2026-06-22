import prismaClient from "../../prisma";
import { partitionPermissions } from "../../utils/permissions";

class RoleAdminService {
  async find(roleId: string) {
    const role = await prismaClient.role.findUnique({
      where: { id: roleId },
      include: { rolePermissions: { select: { permission: true } } },
    });
    if (!role) return null;
    const { rolePermissions, ...rest } = role;
    return { ...rest, permissions: rolePermissions.map((p) => p.permission) };
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
    const { valid, invalid } = partitionPermissions(permissions);

    await prismaClient.$transaction([
      prismaClient.rolePermission.deleteMany({ where: { roleId } }),
      prismaClient.rolePermission.createMany({
        data: valid.map((permission) => ({ roleId, permission })),
      }),
    ]);

    return { ignored: invalid };
  }
}

export { RoleAdminService };
