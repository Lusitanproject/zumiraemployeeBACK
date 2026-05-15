import { z } from "zod";

import { FindCompanyFeedbackRequest } from "../../schemas/company";
import { CreateUserSchema, CreateManyUsersSchema } from "../../schemas/admin/users";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { UserAdminService } from "../admin/UserAdminService";

type CreateUser = z.infer<typeof CreateUserSchema>;
type CreateManyUsers = z.infer<typeof CreateManyUsersSchema>;

class CompanyService {
  async findFeedback({ assessmentId, companyId }: FindCompanyFeedbackRequest) {
    const feedback = await prismaClient.companyAssessmentAnalysis.findFirst({
      where: { companyId, assessmentId },
      select: { text: true, respondents: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return feedback;
  }

  async find(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
      include: {
        companyAvailableAssessments: {
          select: { assessmentId: true },
        },
      },
    });

    return company;
  }

  async createUserForCompany(requesterId: string, data: Omit<CreateUser, "companyId">) {
    const requester = await prismaClient.user.findFirst({ where: { id: requesterId } });
    if (!requester?.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    return new UserAdminService().create({ ...data, companyId: requester.companyId });
  }

  async createManyUsersForCompany(requesterId: string, data: Array<Omit<CreateManyUsers[number], "companyId">>) {
    const requester = await prismaClient.user.findFirst({ where: { id: requesterId } });
    if (!requester?.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    const companyId = requester.companyId;
    return new UserAdminService().createMany(data.map((u) => ({ ...u, companyId })));
  }
}

export { CompanyService };
