import { CompanyAssessmentFeedback } from "@prisma/client";

import { CreateCompanyRequest, UpdateCompanyRequest } from "../../schemas/admin/company";
import { SetCompanyAssessmentsRequest } from "../../schemas/company";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class CompanyAdminService {
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

  async create(data: CreateCompanyRequest) {
    const company = await prismaClient.company.create({ data });
    return company;
  }

  async update({ id, ...data }: UpdateCompanyRequest) {
    const company = await prismaClient.company.update({ where: { id }, data });
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

  async generateAllUserFeedback(companyId: string, sync = true) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
      include: {
        users: {
          select: { id: true },
        },
      },
    });

    if (!company) throw new PublicError("Empresa não encontrada");

    const userIds = company.users.map((u) => u.id);
    if (userIds.length === 0) {
      return {
        companyId,
        queuedCount: 0,
        message: "Empresa sem usuários",
      };
    }

    // Get all assessment results for users in this company
    const allResults = await prismaClient.assessmentResult.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      select: {
        id: true,
        userId: true,
        assessmentId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (allResults.length === 0) {
      return {
        companyId,
        queuedCount: 0,
        message: "Empresa sem resultados de avaliação",
      };
    }

    // Deduplicate: keep only the latest result for each userId + assessmentId pair
    const latestByPair = new Map<string, (typeof allResults)[0]>();
    for (const result of allResults) {
      const key = `${result.userId}#${result.assessmentId}`;
      if (!latestByPair.has(key)) {
        latestByPair.set(key, result);
      }
    }

    const uniquePairs = Array.from(latestByPair.values());
    console.log(
      `Iniciando geração de feedback para empresa ${companyId}: ${uniquePairs.length} pares usuário+avaliação`,
    );

    // Import AssessmentService dynamically to avoid circular dependency
    const { AssessmentService } = await import("../assessment/AssessmentService");

    const tasks = uniquePairs.map(async (pair) => {
      const generateService = new AssessmentService();
      return generateService.generateUserFeedback({ userId: pair.userId, assessmentId: pair.assessmentId }).catch((error) => {
        console.error(
          `Erro ao gerar feedback para usuário ${pair.userId} em avaliação ${pair.assessmentId}: `,
          error instanceof Error ? error.message : String(error),
        );
      });
    });

    if (sync) {
      await Promise.all(tasks);
    }

    return {
      companyId,
      queuedCount: uniquePairs.length,
      message: sync
        ? `${uniquePairs.length} feedbacks gerados com sucesso`
        : `${uniquePairs.length} gerações de feedback enfileiradas com sucesso`,
    };
  }
}

export { CompanyAdminService };
