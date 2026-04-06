import { z } from "zod";

import { CreateUserSchema, FindUserByRequest, UpdateUserSchema } from "../../definitions/admin/users";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

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

  async findBy({ id, email, phoneNumber }: FindUserByRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
        email,
        phoneNumber,
      },
    });

    if (!user) throw new PublicError("Usuário não encontrado");

    const { password, roleId, companyId, nationalityId, currentActChatbotId, ...response } = user;

    return response;
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
    const firstAct = await prismaClient.actChatbot.findFirst({
      orderBy: {
        index: "asc",
      },
    });

    const user = await prismaClient.user.create({
      data: {
        ...data,
        currentActChatbotId: firstAct?.id,
      },
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

  async delete(id: string) {
    await prismaClient.user.delete({ where: { id } });
  }
}

export { UserAdminService };
