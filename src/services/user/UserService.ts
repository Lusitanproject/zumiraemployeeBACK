import { Prisma } from "@prisma/client";
import { hash } from "argon2";
import { z } from "zod";

import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { FindUserByRequest, SearchUsersRequest, UpdateUserSchema, UserFilterColumn } from "../../schemas/admin/users";
import { CreateUserRequest, SyncUserItem, UpdateMeRequest } from "../../schemas/user";
import { tryParsePhone } from "../../utils/phone";

type UpdateUser = z.infer<typeof UpdateUserSchema>;

class UserService {
  async create({ password, ...data }: CreateUserRequest) {
    const userExists = await prismaClient.user.findFirst({ where: { email: data.email } });
    if (userExists) throw new PublicError("Usuário já existe");

    if (data.phoneNumber) {
      const phoneExists = await prismaClient.user.findFirst({ where: { phoneNumber: data.phoneNumber } });
      if (phoneExists) throw new PublicError("Número de telefone já está em uso");
    }

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

  async find(id: string, where?: Prisma.UserWhereInput) {
    const user = await prismaClient.user.findFirst({
      where: { id, ...where },
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
      ...(similarExposureGroup && {
        similarExposureGroup: { contains: similarExposureGroup, mode: "insensitive" as const },
      }),
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

  async update({ id, ...data }: UpdateUser & { id: string }, where?: Prisma.UserWhereInput) {
    if (data.phoneNumber) {
      const phoneExists = await prismaClient.user.findFirst({ where: { phoneNumber: data.phoneNumber, NOT: { id } } });
      if (phoneExists) throw new PublicError("Número de telefone já está em uso");
    }

    if (where) {
      const { count } = await prismaClient.user.updateMany({ where: { id, ...where }, data });
      if (count === 0) return null;
    }

    const user = await prismaClient.user.update({ where: { id }, data });
    const { password: _password, ...response } = user;
    return { ...response };
  }

  async updateMe({ id, password, ...data }: UpdateMeRequest & { id: string }) {
    const user = await prismaClient.user.findUnique({ where: { id } });
    if (!user) throw new PublicError("Usuário não encontrado");

    if (data.phoneNumber) {
      const phoneExists = await prismaClient.user.findFirst({
        where: { phoneNumber: data.phoneNumber, NOT: { id } },
      });
      if (phoneExists) throw new PublicError("Número de telefone já está em uso");
    }

    let passwordUpdate: { password: string; registrationComplete?: boolean } | undefined;

    if (password) {
      if (user.password && user.registrationComplete) {
        throw new PublicError("Não é possível alterar a senha após o cadastro ser concluído");
      }
      passwordUpdate = {
        password: await hash(password),
        ...(user.password ? { registrationComplete: true } : {}),
      };
    }

    const updated = await prismaClient.user.update({
      where: { id },
      data: { ...data, ...passwordUpdate },
    });

    const { password: _password, ...response } = updated;
    return { ...response };
  }

  async delete(id: string, where?: Prisma.UserWhereInput) {
    if (where) {
      const { count } = await prismaClient.user.deleteMany({ where: { id, ...where } });
      return count > 0;
    }
    await prismaClient.user.delete({ where: { id } });
    return true;
  }

  // ─── Sync engine ───────────────────────────────────────────────────────────

  private async planSync(companyId: string, items: SyncUserItem[]) {
    type ConflictType = "CUSTOM_ID_DUPLICATED_IN_DB" | "EMAIL_ALREADY_USED" | "PHONE_ALREADY_USED";

    type SyncPlan = {
      creates: Array<{ customId: string; data: Omit<SyncUserItem, "customId"> }>;
      updates: Array<{
        customId: string;
        userId: string;
        changes: Record<string, { from: unknown; to: unknown }>;
        password?: string;
      }>;
      unchanged: Array<{ customId: string; userId: string }>;
      conflicts: Array<{
        type: ConflictType;
        customId: string;
        email?: string;
        conflictingUserId?: string;
        message: string;
      }>;
      errors: Array<{ customId?: string; field: string; message: string }>;
    };

    const errors: SyncPlan["errors"] = [];
    const conflicts: SyncPlan["conflicts"] = [];

    // Step 1: detect duplicate customIds in payload
    const seen = new Map<string, number>();
    for (const item of items) seen.set(item.customId, (seen.get(item.customId) ?? 0) + 1);

    const payloadDuplicates = new Set<string>();
    for (const [id, count] of seen) if (count > 1) payloadDuplicates.add(id);

    const validItems = items.filter((item) => {
      if (payloadDuplicates.has(item.customId)) {
        if (!errors.some((e) => e.customId === item.customId)) {
          errors.push({ customId: item.customId, field: "customId", message: "customId duplicado no payload" });
        }
        return false;
      }
      return true;
    });

    if (validItems.length === 0) {
      return { creates: [], updates: [], unchanged: [], conflicts, errors } satisfies SyncPlan;
    }

    // Step 1.5: normalize and validate phone numbers per item
    const normalizedItems = validItems.map((item) => {
      if (!item.phoneNumber) return item;
      const parsed = tryParsePhone(item.phoneNumber);
      if (!parsed) {
        errors.push({
          customId: item.customId,
          field: "phoneNumber",
          message: `Número de telefone inválido: "${item.phoneNumber}". Use o código do país + DDD + número (ex: +5511987654321)`,
        });
        return { ...item, phoneNumber: undefined };
      }
      return { ...item, phoneNumber: parsed.format("E.164") };
    });

    // Step 2: batch DB lookups
    const validCustomIds = normalizedItems.map((i) => i.customId);
    const validEmails = normalizedItems.map((i) => i.email);
    const validPhones = normalizedItems.flatMap((i) => (i.phoneNumber ? [i.phoneNumber] : []));

    const selectFields = {
      id: true,
      customId: true,
      companyId: true,
      email: true,
      name: true,
      phoneNumber: true,
      occupation: true,
      occupationLevel: true,
      area: true,
      similarExposureGroup: true,
      location: true,
      skinColor: true,
      hasDisability: true,
      birthdate: true,
      admissionDate: true,
      gender: true,
      nationalityId: true,
      password: true,
      registrationComplete: true,
    } as const;

    const [byCustomId, byEmail, byPhone] = await Promise.all([
      prismaClient.user.findMany({ where: { customId: { in: validCustomIds }, companyId }, select: selectFields }),
      prismaClient.user.findMany({
        where: { email: { in: validEmails } },
        select: { id: true, email: true, customId: true, companyId: true, name: true },
      }),
      prismaClient.user.findMany({
        where: { phoneNumber: { in: validPhones } },
        select: { id: true, phoneNumber: true, customId: true, companyId: true, name: true },
      }),
    ]);

    const customIdMap = new Map<string, typeof byCustomId>();
    for (const u of byCustomId) {
      if (!u.customId) continue;
      const arr = customIdMap.get(u.customId) ?? [];
      arr.push(u);
      customIdMap.set(u.customId, arr);
    }

    const emailMap = new Map<string, (typeof byEmail)[0]>();
    for (const u of byEmail) emailMap.set(u.email, u);

    const phoneMap = new Map<string, (typeof byPhone)[0]>();
    for (const u of byPhone) if (u.phoneNumber) phoneMap.set(u.phoneNumber, u);

    // Step 3: classify
    const creates: SyncPlan["creates"] = [];
    const updates: SyncPlan["updates"] = [];
    const unchanged: SyncPlan["unchanged"] = [];

    const DIFFABLE_FIELDS = [
      "email",
      "name",
      "phoneNumber",
      "occupation",
      "occupationLevel",
      "area",
      "similarExposureGroup",
      "location",
      "skinColor",
      "hasDisability",
      "birthdate",
      "admissionDate",
      "gender",
      "nationalityId",
    ] as const;

    const normalizeDate = (v: unknown) => (v instanceof Date ? v.toISOString() : v);

    for (const item of normalizedItems) {
      const candidates = customIdMap.get(item.customId) ?? [];
      const emailMatch = emailMap.get(item.email);

      if (candidates.length > 1) {
        conflicts.push({
          type: "CUSTOM_ID_DUPLICATED_IN_DB",
          customId: item.customId,
          email: item.email,
          message: `ID externo "${item.customId}" está duplicado no banco (${candidates.length} registros encontrados)`,
        });
        continue;
      }

      const candidate = candidates[0] ?? null;

      if (emailMatch && (!candidate || emailMatch.id !== candidate.id)) {
        conflicts.push({
          type: "EMAIL_ALREADY_USED",
          customId: item.customId,
          email: item.email,
          conflictingUserId: emailMatch.id,
          message: `E-mail "${item.email}" já está em uso por ${emailMatch.name}`,
        });
        continue;
      }

      const phoneMatch = item.phoneNumber ? phoneMap.get(item.phoneNumber) : undefined;

      if (phoneMatch && (!candidate || phoneMatch.id !== candidate.id)) {
        conflicts.push({
          type: "PHONE_ALREADY_USED",
          customId: item.customId,
          email: item.email,
          conflictingUserId: phoneMatch.id,
          message: `Número "${item.phoneNumber}" já está em uso por ${phoneMatch.name}`,
        });
        continue;
      }

      if (candidate) {
        const effectivePassword =
          item.password && candidate.password && candidate.registrationComplete ? undefined : item.password;

        const changes: SyncPlan["updates"][0]["changes"] = {};
        for (const field of DIFFABLE_FIELDS) {
          const toRaw = item[field as keyof typeof item];
          if (toRaw === undefined) continue;
          const fromRaw = candidate[field as keyof typeof candidate];
          const from = normalizeDate(fromRaw);
          const to = normalizeDate(toRaw);
          if (from !== to) changes[field] = { from, to };
        }

        if (Object.keys(changes).length > 0 || effectivePassword) {
          updates.push({ customId: item.customId, userId: candidate.id, changes, password: effectivePassword });
        } else {
          unchanged.push({ customId: item.customId, userId: candidate.id });
        }
      } else {
        const { customId, ...data } = item;
        creates.push({ customId, data });
      }
    }

    return { creates, updates, unchanged, conflicts, errors } satisfies SyncPlan;
  }

  async previewSync(companyId: string, items: SyncUserItem[]) {
    const plan = await this.planSync(companyId, items);
    return {
      summary: {
        received: items.length,
        toCreate: plan.creates.length,
        toUpdate: plan.updates.length,
        unchanged: plan.unchanged.length,
        conflicts: plan.conflicts.length,
        errors: plan.errors.length,
      },
      ...plan,
    };
  }

  async executeSync(companyId: string, items: SyncUserItem[]) {
    const plan = await this.planSync(companyId, items);

    const failed: Array<{ customId?: string; reason: string }> = [
      ...plan.conflicts.map((c) => ({ customId: c.customId, reason: c.type })),
      ...plan.errors.map((e) => ({ customId: e.customId, reason: e.message })),
    ];

    const unchanged = plan.unchanged.map((u) => ({ customId: u.customId, userId: u.userId }));

    const [role, firstAct] = await Promise.all([
      prismaClient.role.findFirst({ where: { NOT: { slug: "admin" } } }),
      prismaClient.actChatbot.findFirst({ orderBy: { index: "asc" } }),
    ]);

    if (!role) throw new Error("Nenhum cargo não-admin encontrado");

    const created: Array<{ customId: string; userId: string }> = [];
    for (const op of plan.creates) {
      try {
        const { password: rawPassword, ...userData } = op.data;
        const user = await prismaClient.user.create({
          data: {
            ...userData,
            customId: op.customId,
            companyId,
            roleId: role.id,
            currentActChatbotId: firstAct?.id,
            ...(rawPassword && { password: await hash(rawPassword), registrationComplete: false }),
          },
        });
        created.push({ customId: op.customId, userId: user.id });
      } catch (err) {
        failed.push({ customId: op.customId, reason: err instanceof Error ? err.message : "Erro desconhecido" });
      }
    }

    const updated: Array<{ customId: string; userId: string }> = [];
    for (const op of plan.updates) {
      try {
        const passwordData = op.password ? { password: await hash(op.password), registrationComplete: false } : {};

        const data = Object.fromEntries(Object.entries(op.changes).map(([k, v]) => [k, v.to]));
        await prismaClient.user.update({ where: { id: op.userId }, data: { ...data, ...passwordData } });
        updated.push({ customId: op.customId, userId: op.userId });
      } catch (err) {
        failed.push({ customId: op.customId, reason: err instanceof Error ? err.message : "Erro desconhecido" });
      }
    }

    return {
      summary: { created: created.length, updated: updated.length, unchanged: unchanged.length, failed: failed.length },
      created,
      updated,
      unchanged,
      failed,
    };
  }
}

export { UserService };
