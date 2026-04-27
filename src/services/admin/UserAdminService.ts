import { z } from "zod";

import {
  CreateManyUsersSchema,
  CreateUserSchema,
  FindUserByRequest,
  UpdateUserSchema,
} from "../../definitions/admin/users";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

type CreateUser = z.infer<typeof CreateUserSchema>;
type CreateManyUsers = z.infer<typeof CreateManyUsersSchema>;
type UpdateUser = z.infer<typeof UpdateUserSchema>;

class UserAdminService {
  async find(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
      include: {
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

    if (!user) return null;

    const { password: _password, ...response } = user;

    return { ...response };
  }

  async findBy({ id, email, customId, phoneNumber }: FindUserByRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
        email,
        customId,
        phoneNumber,
      },
    });

    if (!user) throw new PublicError("Usuário não encontrado");

    const { password: _password, ...response } = user;

    return { ...response };
  }

  async findAll() {
    const users = await prismaClient.user.findMany({
      include: {
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

    return users.map((user) => {
      const { password: _password, ...response } = user;
      return { ...response };
    });
  }

  // Busca um usuário que possua o email informado
  async findByEmail(email: string) {
    const user = await prismaClient.user.findFirst({
      where: { email },
      include: {
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

    if (!user) return null;

    const { password: _password, ...response } = user;

    return { ...response };
  }

  // Lista todos os usuários que pertencem a empresa informada
  async findByCompany(companyId: string) {
    const users = await prismaClient.user.findMany({
      where: { companyId },
      include: {
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

    return users.map((user) => {
      const { password: _password, ...response } = user;
      return { ...response };
    });
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

    const { password: _password, ...response } = user;

    return { ...response };
  }

  async createMany(data: CreateManyUsers) {
    const { companyId } = data[0];
    const allSameCompany = data.every((u) => u.companyId === companyId);

    if (!allSameCompany) throw new PublicError("Todos os usuários cadastrados em lote devem ser da mesma empresa");

    const company = companyId
      ? await prismaClient.company.findFirst({
          where: { id: companyId },
          include: { trail: true },
        })
      : null;

    if (companyId && !company) throw new PublicError("Empresa não encontrada");

    const firstAct = await prismaClient.actChatbot.findFirst({
      where: company ? { trailId: company.trail.id } : undefined,
      orderBy: {
        index: "asc",
      },
    });

    const result = await prismaClient.user.createMany({
      data: data.map((d) => ({ ...d, currentActChatbotId: firstAct?.id })),
    });

    return result;
  }

  async update({ id, ...data }: UpdateUser & { id: string }) {
    const user = await prismaClient.user.update({
      where: { id },
      data,
    });

    const { password: _password, ...response } = user;

    return { ...response };
  }

  async delete(id: string) {
    await prismaClient.user.delete({ where: { id } });
  }
}

export { UserAdminService };
