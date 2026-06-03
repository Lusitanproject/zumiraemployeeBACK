import { z } from "zod";

import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { CreateManyUsersSchema, CreateUserSchema } from "../../schemas/admin/users";

type CreateUser = z.infer<typeof CreateUserSchema>;
type CreateManyUsers = z.infer<typeof CreateManyUsersSchema>;

class UserAdminService {
  async create(data: CreateUser) {
    const [emailExists, phoneExists] = await Promise.all([
      prismaClient.user.findFirst({ where: { email: data.email } }),
      data.phoneNumber
        ? prismaClient.user.findFirst({ where: { phoneNumber: data.phoneNumber } })
        : Promise.resolve(null),
    ]);
    if (emailExists) throw new PublicError("E-mail já está em uso");
    if (phoneExists) throw new PublicError("Número de telefone já está em uso");

    const user = await prismaClient.user.create({
      data: {
        ...data,
        registrationComplete: false,
      },
    });

    const { password: _password, ...response } = user;
    return { ...response };
  }

  async createMany(data: CreateManyUsers) {
    const { companyId } = data[0];
    const allSameCompany = data.every((u) => u.companyId === companyId);

    if (!allSameCompany) throw new PublicError("Todos os usuários cadastrados em lote devem ser da mesma empresa");

    const emails = data.map((d) => d.email);
    const phones = data.flatMap((d) => (d.phoneNumber ? [d.phoneNumber] : []));

    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size < emails.length) throw new PublicError("E-mails duplicados no batch");

    const uniquePhones = new Set(phones);
    if (uniquePhones.size < phones.length) throw new PublicError("Números de telefone duplicados no batch");

    const [existingEmail, existingPhone] = await Promise.all([
      prismaClient.user.findFirst({ where: { email: { in: emails } } }),
      phones.length > 0
        ? prismaClient.user.findFirst({ where: { phoneNumber: { in: phones } } })
        : Promise.resolve(null),
    ]);
    if (existingEmail) throw new PublicError(`E-mail já está em uso: ${existingEmail.email}`);
    if (existingPhone) throw new PublicError(`Número de telefone já está em uso: ${existingPhone.phoneNumber}`);

    const company = companyId
      ? await prismaClient.company.findFirst({
          where: { id: companyId },
        })
      : null;

    if (companyId && !company) throw new PublicError("Empresa não encontrada");

    const result = await prismaClient.user.createMany({
      data: data.map((d) => ({ ...d, registrationComplete: false })),
    });

    return result;
  }
}

export { UserAdminService };
