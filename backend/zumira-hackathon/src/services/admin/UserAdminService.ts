import { z } from "zod";
import prismaClient from "../../prisma";
import { CreateUserSchema, UpdateUserSchema } from "../../definitions/admin/users";

type CreateUser = z.infer<typeof CreateUserSchema>;
type UpdateUser = z.infer<typeof UpdateUserSchema>;

class UserAdminService {
  async find(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });
    return user;
  }

  async findAll() {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });
    return users;
  }

  // Busca um usuário que possua o email informado
  async findByEmail(email: string) {
    const user = await prismaClient.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    return user;
  }

  // Lista todos os usuários que pertencem a empresa informada
  async findByCompany(companyId: string) {
    const users = await prismaClient.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    return users;
  }

  async create(data: CreateUser) {
    const user = await prismaClient.user.create({
      data,
    });

    return user;
  }

  async update({ id, ...data }: UpdateUser & { id: string }) {
    const user = await prismaClient.user.update({
      where: { id },
      data,
    });
    return user;
  }
}

export { UserAdminService };
