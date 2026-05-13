import { z } from "zod";

import { CreateManyUsersSchema, CreateUserSchema } from "../../schemas/admin/users";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

type CreateUser = z.infer<typeof CreateUserSchema>;
type CreateManyUsers = z.infer<typeof CreateManyUsersSchema>;

class UserAdminService {
  async create(data: CreateUser) {
    const firstAct = await prismaClient.actChatbot.findFirst({
      orderBy: { index: "asc" },
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
      orderBy: { index: "asc" },
    });

    const result = await prismaClient.user.createMany({
      data: data.map((d) => ({ ...d, currentActChatbotId: firstAct?.id })),
    });

    return result;
  }
}

export { UserAdminService };
