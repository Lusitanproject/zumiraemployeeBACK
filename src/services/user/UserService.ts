import { hash } from "argon2";
import { z } from "zod";

import { CreateUserRequest } from "../../schemas/user";
import {
  FindUserByRequest,
  SearchUsersRequest,
  UpdateUserSchema,
  UserFilterColumn,
} from "../../schemas/admin/users";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

type UpdateUser = z.infer<typeof UpdateUserSchema>;

class UserService {
  async create({ password, ...data }: CreateUserRequest) {
    const userExists = await prismaClient.user.findFirst({ where: { email: data.email } });
    if (userExists) throw new PublicError("Usuário já existe");

    const role = await prismaClient.role.findFirst({ where: { slug: "user" } });
    if (!role) throw new Error("Cargo usuario não encontrado");

    const firstAct = await prismaClient.actChatbot.findFirst({ orderBy: { index: "asc" } });

    const passwordHash = password ? await hash(password) : null;

    const user = await prismaClient.user.create({
      data: {
        ...data,
        password: passwordHash,
        roleId: role.id,
        currentActChatbotId: firstAct?.id,
      },
    });

    const { password: _password, ...response } = user;

    return { ...response };
  }

  async find(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        role: { select: { id: true, slug: true } },
      },
    });

    if (!user) return null;

    const { password: _password, ...response } = user;
    return { ...response };
  }

  async findBy({ id, email, customId, phoneNumber }: FindUserByRequest) {
    const user = await prismaClient.user.findFirst({
      where: { id, email, customId, phoneNumber },
    });

    if (!user) throw new PublicError("Usuário não encontrado");

    const { password: _password, ...response } = user;
    return { ...response };
  }

  async findAll() {
    const users = await prismaClient.user.findMany({
      include: {
        company: { select: { id: true, name: true } },
        role: { select: { id: true, slug: true } },
      },
    });

    return users.map((user) => {
      const { password: _password, ...response } = user;
      return { ...response };
    });
  }

  async findByEmail(email: string) {
    const user = await prismaClient.user.findFirst({
      where: { email },
      include: {
        company: { select: { id: true, name: true } },
        role: { select: { id: true, slug: true } },
      },
    });

    if (!user) return null;

    const { password: _password, ...response } = user;
    return { ...response };
  }

  async findByCompany(companyId: string) {
    const users = await prismaClient.user.findMany({
      where: { companyId },
      include: {
        company: { select: { id: true, name: true } },
        role: { select: { id: true, slug: true } },
      },
    });

    return users.map((user) => {
      const { password: _password, ...response } = user;
      return { ...response };
    });
  }

  async getFilters(columns: UserFilterColumn[], userIds?: string[]) {
    const result: Record<string, unknown> = {};

    const idFilter = userIds ? { id: { in: userIds } } : {};

    const SCALAR_COLUMNS = [
      "gender",
      "occupation",
      "occupationLevel",
      "area",
      "similarExposureGroup",
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
            where: { ...idFilter, [col]: { not: null } },
            orderBy: { [col]: "asc" },
          });
          result[col] = rows.map((r) => r[col as keyof typeof r]);
        } else if (col === "roleId") {
          const rows = await prismaClient.user.findMany({
            select: { role: { select: { id: true, slug: true } } },
            distinct: ["roleId"],
            where: idFilter,
            orderBy: { role: { slug: "asc" } },
          });
          result[col] = rows.map((r) => r.role);
        } else if (col === "companyId") {
          const rows = await prismaClient.user.findMany({
            select: { company: { select: { id: true, name: true } } },
            distinct: ["companyId"],
            where: { ...idFilter, companyId: { not: null } },
            orderBy: { company: { name: "asc" } },
          });
          result[col] = rows.map((r) => r.company);
        } else if (col === "nationalityId") {
          const rows = await prismaClient.user.findMany({
            select: { nationality: { select: { id: true, name: true } } },
            distinct: ["nationalityId"],
            where: { ...idFilter, nationalityId: { not: null } },
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
    similarExposureGroup,
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
      ...(similarExposureGroup && { similarExposureGroup: { contains: similarExposureGroup, mode: "insensitive" as const } }),
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

export { UserService };
