import { z } from "zod";

import {
  CreateManyUsersSchema,
  CreateUserSchema,
  FindUserByRequest,
  SearchUsersRequest,
  UserFilterColumn,
  UpdateUserSchema,
} from "../../schemas/admin/users";
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

  async getFilters(columns: UserFilterColumn[]) {
    const result: Record<string, unknown> = {};

    const SCALAR_COLUMNS = [
      "gender",
      "occupation",
      "occupationLevel",
      "area",
      "location",
      "skinColor",
      "hasDisability",
    ] as const;

    await Promise.all(
      columns.map(async (col) => {
        if ((SCALAR_COLUMNS as readonly string[]).includes(col)) {
          const rows = await prismaClient.user.findMany({
            select: { [col]: true },
            distinct: [col as never],
            where: { [col]: { not: null } },
            orderBy: { [col]: "asc" },
          });
          result[col] = rows.map((r) => r[col as keyof typeof r]);
        } else if (col === "roleId") {
          const rows = await prismaClient.user.findMany({
            select: { role: { select: { id: true, slug: true } } },
            distinct: ["roleId"],
            orderBy: { role: { slug: "asc" } },
          });
          result[col] = rows.map((r) => r.role);
        } else if (col === "companyId") {
          const rows = await prismaClient.user.findMany({
            select: { company: { select: { id: true, name: true } } },
            distinct: ["companyId"],
            where: { companyId: { not: null } },
            orderBy: { company: { name: "asc" } },
          });
          result[col] = rows.map((r) => r.company);
        } else if (col === "nationalityId") {
          const rows = await prismaClient.user.findMany({
            select: { nationality: { select: { id: true, name: true } } },
            distinct: ["nationalityId"],
            where: { nationalityId: { not: null } },
            orderBy: { nationality: { name: "asc" } },
          });
          result[col] = rows.map((r) => r.nationality);
        }
      }),
    );

    return result;
  }

  async search({
    page,
    pageSize,
    search,
    companyId,
    roleId,
    gender,
    occupation,
    occupationLevel,
    area,
    location,
    skinColor,
    hasDisability,
    nationalityId,
  }: SearchUsersRequest) {
    const where = {
      ...(companyId && { companyId }),
      ...(roleId && { roleId }),
      ...(gender && { gender }),
      ...(occupation && { occupation: { contains: occupation, mode: "insensitive" as const } }),
      ...(occupationLevel && { occupationLevel: { contains: occupationLevel, mode: "insensitive" as const } }),
      ...(area && { area: { contains: area, mode: "insensitive" as const } }),
      ...(location && { location: { contains: location, mode: "insensitive" as const } }),
      ...(skinColor && { skinColor: { contains: skinColor, mode: "insensitive" as const } }),
      ...(hasDisability !== undefined && { hasDisability }),
      ...(nationalityId && { nationalityId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const skip = (page - 1) * pageSize;

    const [total, rawUsers] = await prismaClient.$transaction([
      prismaClient.user.count({ where }),
      prismaClient.user.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          company: { select: { id: true, name: true } },
          role: { select: { id: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const users = rawUsers.map(({ password: _p, ...u }) => u);

    return {
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async delete(id: string) {
    await prismaClient.user.delete({ where: { id } });
  }
}

export { UserAdminService };
