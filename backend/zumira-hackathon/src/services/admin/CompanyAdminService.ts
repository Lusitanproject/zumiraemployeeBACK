import { z } from "zod";
import prismaClient from "../../prisma";
import { CreateCompanySchema } from "../../definitions/admin/company";
import { CompanyAssessmentFeedback } from "@prisma/client";
import { PublicError } from "../../error";

type CreateCompany = z.infer<typeof CreateCompanySchema>;

class CompanyAdminService {
  async find(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
    });
    return company;
  }

  async findAll() {
    const companies = await prismaClient.company.findMany();
    return companies;
  }

  async findAllFeedbacks(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
        companyId: {
          not: null,
        },
      },
    });

    if (!user?.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    const allFeedbacks = await prismaClient.companyAssessmentFeedback.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        assessment: true,
      },
    });

    const aux: Record<string, CompanyAssessmentFeedback> = {};
    allFeedbacks.forEach((f) => {
      const id = f.assessmentId;
      if (!aux[id] || f.createdAt > aux[id].createdAt) aux[id] = f;
    });

    return { items: Object.values(aux) };
  }

  async create(data: CreateCompany) {
    const company = await prismaClient.company.create({ data });
    return company;
  }
}

export { CompanyAdminService };
