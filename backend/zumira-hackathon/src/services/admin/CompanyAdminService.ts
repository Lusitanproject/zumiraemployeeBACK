import { z } from "zod";
import prismaClient from "../../prisma";
import { CreateCompanySchema } from "../../definitions/admin/company";

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

  async findAllFeedbacks(companyId: string) {
    const feedbacks = await prismaClient.companyAssessmentFeedback.findMany({
      where: {
        companyId,
      },
      include: {
        assessment: true,
      },
    });

    return { items: feedbacks };
  }

  async create(data: CreateCompany) {
    const company = await prismaClient.company.create({ data });
    return company;
  }
}

export { CompanyAdminService };
