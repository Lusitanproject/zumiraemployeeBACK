import { AssessmentResultRating, Prisma } from "@prisma/client";
import OpenAI from "openai";
import { ResponseInputItem } from "openai/resources/responses/responses";

import { PublicError } from "../../error";
import { OpenAiApi } from "../../external/openai";
import prismaClient from "../../prisma";
import {
  AssessmentResultFilterColumn,
  CreateAssessment,
  SearchAssessmentResultsQuery,
} from "../../schemas/admin/assessment";
import { DetailResultRequest, ListAssessmentsRequest } from "../../schemas/assessment";
import { calculateResultScores } from "../../utils/calculateResultScores";
import { devLog } from "../../utils/devLog";
import { UserService } from "../user/UserService";

interface QuestionRequest {
  assessmentId: string;
  choices: {
    label: string;
    value: number;
    index: number;
  }[];
  description: string;
  index: number;
  psychologicalDimensionId: string;
}

interface ResultRequest {
  answers: {
    assessmentQuestionId: string;
    assessmentQuestionChoiceId: string;
  }[];
  assessmentId: string;
  userId: string;
}

interface DetailAssessmentRequest {
  assessmentId: string;
  userId: string;
}

interface GenerateFeedbackRequest {
  assessmentId: string;
  userId: string;
}

interface Choice {
  index: number;
  label: string;
  value: number;
  id?: string;
}

interface Question {
  choices: Choice[];
  description: string;
  index: number;
  psychologicalDimensionId: string;
  id?: string;
}

interface UpdateQuestionsRequest {
  assessmentId: string;
  questions: Question[];
}

async function allQuestionsExist(ids: string[]) {
  const questions = await prismaClient.assessmentQuestion.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  for (const id of ids) {
    if (!questions.some((q) => q.id === id)) return false;
  }
  return true;
}

async function allChoicesExist(ids: string[]) {
  const choices = await prismaClient.assessmentQuestionChoice.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  for (const id of ids) {
    if (!choices.some((c) => c.id === id)) return false;
  }
  return true;
}

const assessmentResultInclude = Prisma.validator<Prisma.AssessmentResultDefaultArgs>()({
  include: {
    assessment: {
      include: {
        assessmentResultRatings: true,
        selfMonitoringBlock: true,
      },
    },
    assessmentQuestionAnswers: {
      include: {
        assessmentQuestionChoice: true,
        assessmentQuestion: {
          include: {
            psychologicalDimension: true,
          },
        },
      },
    },
  },
});

type AssessmentResultQueryResponse = Prisma.AssessmentResultGetPayload<typeof assessmentResultInclude>;

function createFeedbackMessage(result: AssessmentResultQueryResponse) {
  const dimensionAnswersValues: Record<string, number[]> = {};
  result.assessmentQuestionAnswers.map((answer) => {
    const dimension = answer.assessmentQuestion.psychologicalDimension.name;
    if (!dimensionAnswersValues[dimension]) dimensionAnswersValues[dimension] = [];
    dimensionAnswersValues[dimension].push(answer.assessmentQuestionChoice.value);
  });

  const message = Object.entries(dimensionAnswersValues)
    .map(([dimension, values]) => {
      const sum = values.reduce((sum, v) => sum + v, 0);
      const average = sum / values.length;
      switch (result.assessment.operationType) {
        case "SUM":
          return `${dimension}: ${sum.toFixed(2)}`;
        case "AVERAGE":
          return `${dimension}: ${average.toFixed(2)}`;
      }
    })
    .join(", ");

  return message;
}

async function sendOpenAIMessage(instructions: string | null, message: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const instructionsObj = {
    role: "system",
    content: [{ type: "input_text", text: instructions }],
  } as ResponseInputItem;

  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      ...(instructions ? [instructionsObj] : []),
      { role: "user", content: [{ type: "input_text", text: message }] },
    ],
    text: { format: { type: "text" } },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
    store: true,
  });

  return response;
}

async function generateUserFeedbackResponse(
  instructions: string | null,
  message: string,
  ratings: AssessmentResultRating[],
) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const instructionsObj = {
    role: "system",
    content: [{ type: "input_text", text: instructions }],
  } as ResponseInputItem;

  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: [
      ...(instructions ? [instructionsObj] : []),
      { role: "user", content: [{ type: "input_text", text: message }] },
    ],
    tools: [
      {
        type: "function",
        name: "generate_feedback",
        description:
          "Devolutiva do teste psicológico, interpretando os resultados de seus domínios avaliados e identificando perfis associados.",
        parameters: {
          type: "object",
          required: ["feedback", "identifiedProfile", "generateAlert"],
          properties: {
            feedback: {
              type: "string",
              description:
                "Texto longo, completo e detalhado da devolutiva de acordo com a interpretação dos resultados. Utilize markdown.",
            },
            identifiedProfile: {
              type: "string",
              description: "Perfil identificado baseado nos escores obtidos.",
              enum: ratings.map((r) => r.profile),
            },
            generateAlert: {
              type: "boolean",
              description: "Indica se é necessário gerar um alerta com base no perfil identificado.",
            },
          },
          additionalProperties: false,
        },
        strict: true,
      },
    ],
    tool_choice: { type: "function", name: "generate_feedback" },
    max_output_tokens: 4096,
  });

  return response;
}

class AssessmentService {
  async create(data: CreateAssessment) {
    const block = await prismaClient.selfMonitoringBlock.findFirst({
      where: { id: data.selfMonitoringBlockId },
    });

    if (!block) throw new PublicError("Bloco de auto monitoramento não existe");

    const assessment = await prismaClient.assessment.create({
      data: { ...data },
      select: {
        id: true,
        title: true,
        summary: true,
        description: true,
        selfMonitoringBlockId: true,
      },
    });

    return assessment;
  }

  async createQuestion({ description, assessmentId, index, psychologicalDimensionId, choices }: QuestionRequest) {
    const assessmentExists = await prismaClient.assessment.findFirst({ where: { id: assessmentId } });
    if (!assessmentExists) throw new PublicError("Avaliação não existe");

    const dimensionExists = await prismaClient.psychologicalDimension.findFirst({
      where: { id: psychologicalDimensionId },
    });
    if (!dimensionExists) throw new PublicError("Dimensão psicológica não existe");

    const question = await prismaClient.assessmentQuestion.create({
      data: { description, index, assessmentId, psychologicalDimensionId },
      select: {
        id: true,
        description: true,
        assessmentId: true,
        psychologicalDimensionId: true,
      },
    });

    await prismaClient.assessmentQuestionChoice.createMany({
      data: choices.map((c) => ({
        label: c.label,
        value: c.value,
        index: c.index,
        assessmentQuestionId: question.id,
      })),
    });

    return question;
  }

  async createResult({ userId, assessmentId, answers }: ResultRequest) {
    const userExists = await prismaClient.user.findFirst({ where: { id: userId } });
    if (!userExists) throw new PublicError("Usuário não existe");

    const assessmentExists = await prismaClient.assessment.findFirst({ where: { id: assessmentId } });
    if (!assessmentExists) throw new PublicError("Avaliação não existe");

    if (!allQuestionsExist(answers.map((a) => a.assessmentQuestionId))) {
      throw new PublicError("Uma ou mais perguntas não existem");
    }

    if (!allChoicesExist(answers.map((a) => a.assessmentQuestionChoiceId))) {
      throw new PublicError("Uma ou mais opções não existem");
    }

    const result = await prismaClient.assessmentResult.create({
      data: { userId, assessmentId },
      select: { id: true, userId: true, assessmentId: true },
    });

    await prismaClient.assessmentQuestionAnswer.createMany({
      data: answers.map((a) => ({
        userId,
        assessmentQuestionId: a.assessmentQuestionId,
        assessmentQuestionChoiceId: a.assessmentQuestionChoiceId,
        assessmentResultId: result.id,
      })),
    });

    return result;
  }

  async detail({ userId, assessmentId }: DetailAssessmentRequest) {
    const assessment = await prismaClient.assessment.findFirst({
      where: { id: assessmentId },
      select: {
        id: true,
        title: true,
        description: true,
        summary: true,
        selfMonitoringBlock: {
          select: { id: true, title: true, summary: true, icon: true },
        },
        assessmentQuestions: {
          select: {
            id: true,
            description: true,
            index: true,
            assessmentQuestionChoices: {
              select: { id: true, label: true, value: true, index: true },
            },
          },
        },
        assessmentResults: {
          where: { userId },
          select: { createdAt: true },
        },
        nationality: {
          select: { acronym: true, name: true },
        },
      },
    });

    if (!assessment) throw new PublicError("Avaliação não existe");

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      assessmensQuestions: assessment.assessmentQuestions,
      selfMonitoringBlock: assessment.selfMonitoringBlock,
      nationality: assessment.nationality,
      lastCompleted: new Date(Math.max(...assessment.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
    };
  }

  async detailResult({ userId, assessmentId }: DetailResultRequest) {
    const result = await prismaClient.assessmentResult.findFirst({
      where: { userId, assessmentId },
      select: {
        id: true,
        feedback: true,
        assessmentResultRating: {
          select: { risk: true, profile: true, color: true },
        },
        assessment: {
          select: {
            id: true,
            title: true,
            summary: true,
            description: true,
            nationality: { select: { name: true, acronym: true } },
            selfMonitoringBlock: {
              select: {
                id: true,
                icon: true,
                title: true,
                summary: true,
                psychologicalDimensions: { select: { acronym: true, name: true } },
              },
            },
          },
        },
        assessmentQuestionAnswers: {
          select: {
            assessmentQuestionChoice: {
              select: { label: true, value: true, index: true },
            },
            assessmentQuestion: {
              select: {
                description: true,
                index: true,
                psychologicalDimension: { select: { name: true, acronym: true } },
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!result) throw new PublicError("Nenhum resultado para esta avaliação");

    const dimensions: Record<
      string,
      (typeof result.assessmentQuestionAnswers)[0]["assessmentQuestion"]["psychologicalDimension"]
    > = {};

    result.assessmentQuestionAnswers.forEach((q) => {
      const dimension = q.assessmentQuestion.psychologicalDimension;
      const id = dimension.acronym + dimension.name;
      dimensions[id] = dimension;
    });

    return { ...result, psychologicalDimensions: Object.values(dimensions) };
  }

  async generateCompanyFeedback({ userId, assessmentId }: GenerateFeedbackRequest) {
    const company = await prismaClient.company.findFirst({
      where: { users: { some: { id: userId } } },
      include: { users: true },
    });

    if (!company) throw new PublicError("Usuário não encontrado ou sem empresa associada.");

    const allResults = await prismaClient.assessmentResult.findMany({
      where: { assessmentId, user: { companyId: company.id } },
      include: {
        assessment: true,
        assessmentQuestionAnswers: {
          include: {
            assessmentQuestion: { include: { psychologicalDimension: true } },
            assessmentQuestionChoice: true,
          },
        },
      },
    });

    if (!allResults.length) throw new PublicError("Esta empresa não possui resultados para esta avaliação");

    const exampleResult = allResults[0];
    const assessment = exampleResult.assessment;

    const latestResults: Record<string, typeof exampleResult> = {};
    allResults.forEach((r) => {
      if (!latestResults[r.userId] || latestResults[r.userId].createdAt < r.createdAt) latestResults[r.userId] = r;
    });

    const dimensionScores: Record<string, number[]> = {};

    for (const result of Object.values(latestResults)) {
      const userDimensionAnswersValues: Record<string, number[]> = {};

      for (const answer of result.assessmentQuestionAnswers) {
        const dimension = answer.assessmentQuestion.psychologicalDimension.name;
        if (!userDimensionAnswersValues[dimension]) userDimensionAnswersValues[dimension] = [];
        userDimensionAnswersValues[dimension].push(answer.assessmentQuestionChoice.value);
      }

      for (const [dimension, scores] of Object.entries(userDimensionAnswersValues)) {
        const sum = scores.reduce((sum, v) => sum + v, 0);
        const average = sum / scores.length;
        if (!dimensionScores[dimension]) dimensionScores[dimension] = [];
        switch (assessment.operationType) {
          case "SUM":
            dimensionScores[dimension].push(sum);
            break;
          case "AVERAGE":
            dimensionScores[dimension].push(average);
            break;
        }
      }
    }

    const message = Object.entries(dimensionScores)
      .map(([dimension, scores]) => {
        const average = scores.reduce((sum, v) => sum + v, 0) / scores.length;
        return `${dimension}: ${average.toFixed(2)}`;
      })
      .join(", ");

    if (!message) throw new PublicError("Nenhum valor para enviar");

    const response = await sendOpenAIMessage(assessment.companyFeedbackInstructions, message);

    const openAiApi = new OpenAiApi();

    console.log(`[RAG/assessment] starting RAG setup for assessmentId=${assessmentId} companyId=${company.id}`);

    const { dbVectorStore } = await openAiApi.createVectorStoreWithContent({
      storeName: `analysis-assessment-${assessmentId}`,
      content: response.output_text,
      filename: "feedback.md",
    });

    console.log(`[RAG/assessment] vector store ready: db=${dbVectorStore.id}`);

    const assessmentFeedback = await prismaClient.companyAssessmentAnalysis.create({
      data: {
        text: response.output_text,
        companyId: company.id,
        assessmentId,
        respondents: Object.keys(latestResults).length,
        vectorStoreId: dbVectorStore.id,
      },
      select: { id: true, text: true, companyId: true, assessmentId: true },
    });

    return assessmentFeedback;
  }

  async generateUserFeedback({ userId, assessmentId }: GenerateFeedbackRequest) {
    const result = await prismaClient.assessmentResult.findFirst({
      where: { assessmentId, userId },
      include: assessmentResultInclude.include,
      orderBy: { createdAt: "desc" },
    });
    if (!result) throw new PublicError("Nenhum resultado para esta avaliação");

    const message = createFeedbackMessage(result);
    if (!message) throw new PublicError("Nenhum valor para enviar");
    devLog("Message: ", message);

    const response = await generateUserFeedbackResponse(
      result.assessment.userFeedbackInstructions,
      message,
      result.assessment.assessmentResultRatings,
    );

    const toolCall = response.output[0] as unknown as { arguments: string };
    const args = JSON.parse(toolCall.arguments) as {
      feedback: string;
      identifiedProfile: string;
      generateAlert: boolean;
    };

    devLog("AI response: ", args);

    const ratings = result.assessment.assessmentResultRatings;
    const rating = ratings.find((r) => r.profile === args.identifiedProfile);
    if (!rating && ratings.length !== 0) {
      throw new PublicError(`Perfil "${args.identifiedProfile}" não existe`);
    }

    await prismaClient.assessmentResult.update({
      where: { id: result.id },
      data: { feedback: args.feedback, assessmentResultRatingId: rating?.id },
    });

    if (args.generateAlert && rating) {
      await prismaClient.alert.create({
        data: { assessmentResultId: result.id, assessmentResultRatingId: rating.id },
      });
    }

    return args;
  }

  async list({ userId, nationalityId }: ListAssessmentsRequest) {
    const user = await prismaClient.user.findFirst({ where: { id: userId } });
    if (!user) throw new PublicError("Usuário não existe");

    const assessments = await prismaClient.assessment.findMany({
      where: {
        nationalityId,
        public: true,
        companyAvailableAssessments: user.companyId ? { some: { companyId: user.companyId } } : undefined,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        selfMonitoringBlock: { select: { id: true, title: true } },
        assessmentResults: {
          where: { userId },
          select: { createdAt: true },
        },
      },
    });

    const formattedAssessments = assessments.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      selfMonitoring: a.selfMonitoringBlock,
      lastCompleted: new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
    }));

    return { assessments: formattedAssessments };
  }

  async listByCompany(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      select: { companyId: true },
    });

    if (!user) throw new PublicError("Usuário não existe");
    if (!user.companyId) throw new PublicError("Usuário não está associado a uma empresa");

    const assessments = await prismaClient.assessment.findMany({
      where: {
        companyAvailableAssessments: { some: { companyId: user.companyId } },
      },
      select: {
        id: true,
        title: true,
        summary: true,
        public: true,
        selfMonitoringBlock: { select: { id: true, title: true } },
        assessmentResults: {
          where: { userId },
          select: { createdAt: true },
        },
        createdAt: true,
      },
      orderBy: { title: "asc" },
    });

    const formattedAssessments = assessments.map((a) => {
      const hasResults = a.assessmentResults.length > 0;
      return {
        id: a.id,
        title: a.title,
        summary: a.summary,
        public: a.public,
        selfMonitoring: a.selfMonitoringBlock,
        lastCompleted: hasResults
          ? new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime())))
          : null,
        createdAt: a.createdAt,
      };
    });

    return { assessments: formattedAssessments };
  }

  async listResults(userId: string) {
    const results = await prismaClient.assessmentResult.findMany({
      where: { userId },
      include: {
        assessment: { select: { id: true, title: true, summary: true } },
      },
    });

    const latestResults: Record<string, (typeof results)[0]> = {};
    results.forEach((r) => {
      if (!latestResults[r.assessment.id] || latestResults[r.assessment.id].createdAt < r.createdAt) {
        latestResults[r.assessment.id] = r;
      }
    });

    return { items: Object.values(latestResults) };
  }

  async updateQuestions({ assessmentId, questions }: UpdateQuestionsRequest) {
    const startTime = new Date();

    const oldQuestions = await prismaClient.assessmentQuestion.findMany({
      where: { assessmentId },
      include: { assessmentQuestionChoices: true },
    });
    const oldChoices = oldQuestions.map((q) => q.assessmentQuestionChoices.map((c) => c)).flat();

    const deletedQuestions = oldQuestions.filter((oldQuestion) => !questions.some((q) => oldQuestion.id === q.id));
    const deletedChoices = oldChoices.filter(
      (oldChoice) => !questions.some((q) => q.choices.some((c) => oldChoice.id === c.id)),
    );

    for (const question of questions) {
      if (!question.id) {
        const createdQuestion = await prismaClient.assessmentQuestion.create({
          data: {
            assessmentId,
            description: question.description,
            index: question.index,
            psychologicalDimensionId: question.psychologicalDimensionId,
          },
          select: { id: true, description: true, index: true, assessmentId: true, psychologicalDimensionId: true },
        });

        await prismaClient.assessmentQuestionChoice.createManyAndReturn({
          data: question.choices.map((c) => ({
            label: c.label,
            value: c.value,
            index: c.index,
            assessmentQuestionId: createdQuestion.id,
          })),
        });
      } else {
        const storedQuestion = oldQuestions.find((q) => q.id === question.id);
        const updated =
          storedQuestion?.description !== question.description ||
          storedQuestion.index !== question.index ||
          storedQuestion.psychologicalDimensionId !== question.psychologicalDimensionId;

        if (updated) {
          await prismaClient.assessmentQuestion.update({
            where: { id: question.id },
            data: {
              description: question.description,
              index: question.index,
              psychologicalDimensionId: question.psychologicalDimensionId,
            },
          });
        }

        for (const choice of question.choices) {
          if (!choice.id) {
            await prismaClient.assessmentQuestionChoice.create({
              data: {
                index: choice.index,
                label: choice.label,
                value: choice.value,
                assessmentQuestionId: question.id,
              },
              select: { id: true, label: true, value: true, index: true, assessmentQuestionId: true },
            });
          } else {
            const storedChoice = oldChoices.find((c) => c.id === choice.id);
            const updated =
              storedChoice?.index !== choice.index ||
              storedChoice.label !== choice.label ||
              storedChoice.value !== choice.value;

            if (updated) {
              await prismaClient.assessmentQuestionChoice.update({
                where: { id: choice.id },
                data: { index: choice.index, label: choice.label, value: choice.value },
              });
            }
          }
        }
      }
    }

    await prismaClient.assessmentQuestion.deleteMany({
      where: { id: { in: deletedQuestions.map((q) => q.id).filter((id) => id !== undefined) } },
    });
    await prismaClient.assessmentQuestionChoice.deleteMany({
      where: { id: { in: deletedChoices.map((c) => c.id).filter((id) => id !== undefined) } },
    });

    const endTime = new Date();
    const timeDiffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`Updated assessment ${assessmentId} questions in ${timeDiffInSeconds} seconds`);
  }
  private async processResults(
    results: Array<{
      id: string;
      user: { id: string; name: string | null; email: string; companyId: string | null; customId: string | null };
      assessmentResultRating: { risk: string; profile: string; color: string } | null;
      createdAt: Date;
    }>,
  ) {
    const aux: Record<string, (typeof results)[0]> = {};
    for (const result of results) {
      if (!aux[result.user.id] || new Date(aux[result.user.id].createdAt) < new Date(result.createdAt)) {
        aux[result.user.id] = result;
      }
    }
    const lastResults = Object.values(aux);
    const scores = await calculateResultScores(lastResults.map((r) => r.id));
    return lastResults.map((r) => ({
      ...r,
      scores: scores.find((s) => s.assessmentResultId === r.id)?.scores,
    }));
  }

  async searchResults(
    assessmentId: string,
    {
      companyId,
      search,
      page,
      pageSize,
      gender,
      area,
      similarExposureGroup,
      location,
      occupation,
      occupationLevel,
      skinColor,
      hasDisability,
      nationalityId,
    }: SearchAssessmentResultsQuery,
  ) {
    const RESULT_SELECT = {
      id: true,
      user: { select: { id: true, name: true, email: true, companyId: true, customId: true } },
      assessmentResultRating: { select: { risk: true, profile: true, color: true } },
      createdAt: true,
    } as const;

    const results = await prismaClient.assessmentResult.findMany({
      where: {
        assessmentId,
        feedback: { not: null },
        assessmentResultRatingId: { not: null },
        ...(search && { assessmentResultRating: { profile: { contains: search, mode: "insensitive" } } }),
        user: {
          ...(companyId && { companyId }),
          ...(gender && { gender }),
          ...(area && { area }),
          ...(similarExposureGroup && { similarExposureGroup }),
          ...(location && { location }),
          ...(occupation && { occupation }),
          ...(occupationLevel && { occupationLevel }),
          ...(skinColor && { skinColor }),
          ...(hasDisability !== undefined && { hasDisability }),
          ...(nationalityId && { nationalityId }),
        },
      },
      select: RESULT_SELECT,
    });

    const allItems = await this.processResults(results);
    const total = allItems.length;
    const offset = (page - 1) * pageSize;
    const items = allItems.slice(offset, offset + pageSize);

    return { available: true, items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getResultUserFilters(
    assessmentId: string,
    companyId: string | undefined,
    columns: AssessmentResultFilterColumn[],
  ) {
    const rows = await prismaClient.assessmentResult.findMany({
      where: {
        assessmentId,
        feedback: { not: null },
        assessmentResultRatingId: { not: null },
        ...(companyId && { user: { companyId } }),
      },
      select: { userId: true },
      distinct: ["userId"],
    });

    const userIds = rows.map((r) => r.userId);
    const filters = await new UserService().getFilters(columns, userIds);
    return { filters };
  }
}

export { AssessmentService };
