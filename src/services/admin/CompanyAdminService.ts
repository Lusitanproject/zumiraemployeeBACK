import { BatchStatus, CompanyActAnalysisBatch, CompanyAssessmentFeedback, PsychosocialFactor } from "@prisma/client";

import { CreateCompanyRequest, UpdateCompanyRequest } from "../../schemas/admin/company";
import { SetCompanyAssessmentsRequest } from "../../schemas/company";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { CreateOpenAiBatchRequest, OpenAiApi } from "../../external/openai";

interface ActAnalysisBatchResult {
  associations: {
    message_id: string;
    factor_id: string;
  }[];
}

interface ActAnalysisItem {
  factor: {
    id: string;
    name: string;
    selfMonitoringBlock: {
      id: string;
      title: string;
    } | null;
    _count: Record<string, number>;
  };
}

type FindActAnalysisResult =
  | {
      available: false;
    }
  | {
      available: true;
      items: ActAnalysisItem[];
    };

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

  private async buildPsychosocialPrompt(factors: Partial<PsychosocialFactor>[]) {
    const factorsJson = JSON.stringify(factors);

    return `
Você é um classificador técnico especializado em fatores psicossociais em comunicações corporativas.

Sua tarefa é analisar mensagens de uma conversa e identificar somente os fatores psicossociais que realmente se aplicam às mensagens enviadas por usuários.

Os fatores disponíveis são:

${factorsJson}

Você receberá um JSON contendo:

- messages: lista de mensagens da conversa, onde cada item possui:
  - id
  - role
  - content

Objetivo:

Avaliar somente mensagens cujo role seja "user" e retornar apenas as combinações positivas (mensagem x fator) em que exista aderência real.

Regras obrigatórias:

1. Analise apenas mensagens com role igual a "user".
2. Ignore mensagens com qualquer outro role no resultado final.
3. Considere todas as mensagens da conversa como contexto para interpretação.
4. Avalie todos os fatores listados acima para cada mensagem elegível.
5. O campo factor_id é string.
6. Retorne somente fatores com aderência positiva.
7. Não retorne fatores negativos, inconclusivos ou nulos.
8. Se o factor_id for nulo, indefinido ou não aplicável, não inclua item em results.
9. Utilize somente os fatores fornecidos.
10. Nunca invente fatores.
11. Considere significado semântico, tom, intenção e sinais indiretos.
12. Seja criterioso e conservador. Só classifique quando houver evidência razoável.
13. Se nenhuma mensagem de role "user" possuir aderência a qualquer fator, retorne results vazio.
14. Retorne apenas JSON válido.
15. Não inclua explicações, comentários ou texto adicional.

Formato obrigatório de resposta:

{
  "associations": [
    {
      "message_id": "string",
      "factor_id": "string"
    }
  ]
}
`.trim();
  }

  async generateActAnalysis(id: string, actChatbotId: string) {
    console.log(`Gerando análise para a empresa ${id} e o chatbot ${actChatbotId}`);

    const factors = await prismaClient.psychosocialFactor.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const chapters = await prismaClient.actChapter.findMany({
      where: {
        actChatbot: {
          id: actChatbotId,
        },
        user: {
          companyId: id,
        },
      },
      include: {
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
          },
        },
      },
    });

    const newAnalysis = await prismaClient.companyActAnalysis.create({
      data: {
        actChatbotId,
        companyId: id,
      },
    });

    const instructions = await this.buildPsychosocialPrompt(factors);
    const batchItems: CreateOpenAiBatchRequest["batchItems"] = chapters.map((chapter) => ({
      customId: chapter.id,
      messages: [{ content: JSON.stringify(chapter.messages), role: "user" }],
    }));

    const openai = new OpenAiApi();
    const batchResult = await openai.createBatch({ instructions, batchItems });

    console.log(`Lote OpenAI criado com ${batchItems.length} itens`);

    await prismaClient.companyActAnalysisBatch.create({
      data: {
        batchId: batchResult.batchId,
        companyActAnalysisId: newAnalysis.id,
      },
    });
  }

  private async retrieveAndSaveResults(storedBatches: CompanyActAnalysisBatch[]): Promise<boolean> {
    const openai = new OpenAiApi();

    const pendingBatches = storedBatches.filter((batch) => batch.status !== "completed");

    const batchResults = await Promise.all(
      pendingBatches.map((pending) => openai.retrieveBatchResult<ActAnalysisBatchResult>(pending.batchId)),
    );

    batchResults.forEach(({ batchId, status }) => {
      console.log(`Lote OpenAI ${batchId} retornou status ${status}`);
    });

    batchResults.forEach(({ batchId, results }) => {
      results?.forEach(({ customId, data }) => {
        console.log(`Lote OpenAI ${batchId} resultado ${customId ?? "sem customId"}: ${JSON.stringify(data, null, 2)}`);
      });
    });

    const newCompletedBatchResults = batchResults.filter((batchRes) => batchRes.status === "completed");

    const allDone = newCompletedBatchResults.length === pendingBatches.length;

    console.log(
      `Lotes processados: total ${storedBatches.length}, concluídos ${newCompletedBatchResults.length}, pendentes ${pendingBatches.length - newCompletedBatchResults.length}`,
    );

    const externalToLocalBatchId = pendingBatches.reduce((prev, curr) => {
      prev.set(curr.batchId, curr.id);
      return prev;
    }, new Map<string, string>());

    await prismaClient.actMessagesPsychosocialFactors.createMany({
      data: newCompletedBatchResults.flatMap(
        ({ results, batchId }) =>
          results?.flatMap(({ data }) =>
            data
              ? data.associations.map((a) => ({
                  factorId: a.factor_id,
                  messageId: a.message_id,
                  analysisBatchId: externalToLocalBatchId.get(batchId)!,
                }))
              : [],
          ) ?? [],
      ),
    });

    await Promise.all(
      batchResults.map(({ batchId, status }) =>
        prismaClient.companyActAnalysisBatch.update({
          where: {
            id: externalToLocalBatchId.get(batchId)!,
          },
          data: {
            status,
          },
        }),
      ),
    );

    return allDone;
  }

  async findActAnalysis(id: string, actChatbotId: string): Promise<FindActAnalysisResult> {
    console.log(`Buscando análise da empresa ${id} para o chatbot ${actChatbotId}`);

    const analysis = await prismaClient.companyActAnalysis.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        companyId: id,
        actChatbotId,
      },
      include: {
        companyActAnalysisBatches: true,
      },
    });

    if (!analysis) {
      throw new PublicError("No act analysis for this company was found.");
    }

    const alreadySaved = analysis.companyActAnalysisBatches.every((batch) => batch.status === "completed");

    if (!alreadySaved) {
      console.log("Análise com pendências, tentando atualizar os lotes");

      const allDone = await this.retrieveAndSaveResults(analysis.companyActAnalysisBatches);

      if (!allDone) {
        console.log("Análise ainda pendente");

        return { available: false };
      }
    }

    const analysisRows = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        analysisBatch: {
          companyActAnalysisId: analysis.id,
        },
      },

      select: {
        factor: {
          select: {
            id: true,
            name: true,
            selfMonitoringBlock: {
              select: {
                id: true,
                title: true,
              },
            },
            _count: true,
          },
        },
      },
    });

    console.log(`Análise pronta com ${analysisRows.length} registros`);

    return {
      available: true,
      items: analysisRows,
    };
  }
}

export { CompanyAdminService };
