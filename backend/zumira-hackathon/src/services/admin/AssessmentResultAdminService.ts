import { Workbook } from "exceljs";
import prismaClient from "../../prisma";
import { calculateResultScores } from "../../utils/calculateResultScores";
import { AssessmentByCompanyRequest } from "../../definitions/admin/assessment";

class AssessmentResultAdminService {
  async findFiltered({ assessmentId, companyId }: AssessmentByCompanyRequest) {
    const results = await prismaClient.assessmentResult.findMany({
      where: {
        assessmentId,
        user: {
          companyId,
        },
        feedback: {
          not: null,
        },
        assessmentResultRatingId: {
          not: null,
        },
      },

      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyId: true,
          },
        },
        assessmentResultRating: {
          select: {
            risk: true,
            profile: true,
            color: true,
          },
        },
        createdAt: true,
      },
    });

    const aux: Record<string, (typeof results)[0]> = {};
    for (const result of results) {
      if (!aux[result.user.id] || new Date(aux[result.user.id].createdAt) < new Date(result.createdAt)) {
        aux[result.user.id] = result;
      }
    }
    const lastResults = Object.values(aux);

    const scores = await calculateResultScores(lastResults.map((r) => r.id));

    const processedData = lastResults.map((r) => ({
      ...r,
      scores: scores.find((s) => s.assessmentResultId === r.id)?.scores,
    }));

    return { items: processedData };
  }

  async generateExcelReport({ assessmentId, companyId }: AssessmentByCompanyRequest) {
    const assessment = await prismaClient.assessment.findFirst({
      where: {
        id: assessmentId,
      },
      include: {
        assessmentQuestions: true,
      },
    });

    if (!assessment) throw new Error("Assessment not found");

    const results = await prismaClient.assessmentResult.findMany({
      where: {
        assessmentId,
        user: {
          companyId,
        },
        feedback: {
          not: null,
        },
        assessmentResultRatingId: {
          not: null,
        },
      },

      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            companyId: true,
          },
        },
        assessmentQuestionAnswers: {
          include: {
            assessmentQuestion: true,
            assessmentQuestionChoice: true,
          },
        },
        createdAt: true,
      },
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(`Relatório ${assessment.title}`);

    worksheet.columns = [
      { header: "Carimbo de data", key: "date", width: 15 },
      { header: "Código", key: "code", width: 6 },
      ...assessment.assessmentQuestions.flatMap((question) => [
        { header: `${question.description}`, key: `question_${question.index}`, width: 50 },
        { header: `${question.index}`, key: `index_${question.index}`, width: 3 },
      ]),
    ];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const row: Record<string, any> = { date: result.createdAt, code: `C-${(i + 1).toString().padStart(3, "0")}` };

      for (let j = 0; j < result.assessmentQuestionAnswers.length; j++) {
        const answer = result.assessmentQuestionAnswers[j];
        row[`question_${answer.assessmentQuestion.index}`] = answer.assessmentQuestionChoice.label;
        row[`index_${answer.assessmentQuestion.index}`] = answer.assessmentQuestionChoice.value;
      }

      worksheet.addRow(row);
    }

    return workbook;
  }
}

export { AssessmentResultAdminService };
