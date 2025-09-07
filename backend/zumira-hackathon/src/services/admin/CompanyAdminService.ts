import { CompanyAssessmentFeedback } from "@prisma/client";
import { z } from "zod";

import { CreateCompanySchema } from "../../definitions/admin/company";
import { SetCompanyAssessmentsRequest } from "../../definitions/company";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

type CreateCompany = z.infer<typeof CreateCompanySchema>;

class CompanyAdminService {
  async find(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
      include: {
        companyAvailableAssessments: {
          select: {
            assessmentId: true,
          },
        },
      },
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

  async setCompanyAssessments({ id: companyId, assessmentIds }: SetCompanyAssessmentsRequest) {
    const [company, newAssessments, currentAssessments] = await Promise.all([
      prismaClient.company.findFirst({
        where: {
          id: companyId,
        },
      }),

      prismaClient.assessment.findMany({
        where: {
          id: {
            in: assessmentIds,
          },
        },
      }),

      prismaClient.companyAvailableAssessment.findMany({ where: { companyId } }),
    ]);

    if (!company) throw new Error("Empresa não existe");
    if (assessmentIds.find((id) => !newAssessments.find((assessment) => id === assessment.id))) {
      throw new Error("Um ou mais testes enviados não existem");
    }

    const deletedAssessmentIds = currentAssessments
      .filter((curr) => !assessmentIds.includes(curr.assessmentId))
      .map((item) => item.assessmentId);

    await Promise.all([
      prismaClient.companyAvailableAssessment.createMany({
        data: assessmentIds.map((assessmentId) => ({
          assessmentId,
          companyId,
        })),
        skipDuplicates: true,
      }),

      prismaClient.companyAvailableAssessment.deleteMany({
        where: {
          assessmentId: {
            in: deletedAssessmentIds,
          },
        },
      }),
    ]);
  }
}

export { CompanyAdminService };
