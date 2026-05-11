import { CompanyActAnalysisBatch, PsychosocialFactor } from "@prisma/client";

import { PublicError } from "../../error";
import { CreateOpenAiBatchRequest, OpenAiApi } from "../../external/openai";
import prismaClient from "../../prisma";

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
    wheight: number;
    weightedScore: number;
  };
  selfMonitoringBlock: {
    id: string;
    name: string;
  };
  count: number;
}

interface SelfMonitoringBlockSummary {
  id: string;
  name: string;
  topFactors: Array<{
    id: string;
    name: string;
    wheight: number;
    weightedScore: number;
    count: number;
  }>;
}

interface ActAnalysisFilters {
  search?: string;
  gender?: string;
  area?: string;
  location?: string;
  occupation?: string;
  occupationLevel?: string;
  skinColor?: string;
  hasDisability?: boolean;
  nationalityId?: string;
}

type UserGroupColumn =
  | "gender"
  | "area"
  | "location"
  | "occupation"
  | "occupationLevel"
  | "skinColor"
  | "hasDisability"
  | "nationalityId"
  | "age";

type RangeBucket = { label: string; min: number; max: number };

type SegmentScores = {
  positiveScore: number;
  negativeScore: number;
  totalScore: number;
  absoluteScore: number;
  wellnessPercentage: number;
};

type AnalysisSegmentGroup = SegmentScores & { value: string | null };

type FindActAnalysisSegmentsResult =
  | { available: false }
  | { available: true; column: UserGroupColumn; groups: AnalysisSegmentGroup[] };

type FactorWeightItem = {
  id: string;
  name: string;
  wheight: number;
  count: number;
  totalWeight: number;
};

type FindActAnalysisFactorWeightsResult =
  | { available: false }
  | { available: true; factors: FactorWeightItem[]; userCount: number };

type AnalysisReport = {
  userCount: number;
  overall: SegmentScores;
  byArea: AnalysisSegmentGroup[];
  byGender: AnalysisSegmentGroup[];
  byDisability: AnalysisSegmentGroup[];
  byOccupationLevel: AnalysisSegmentGroup[];
  byAgeRange: AnalysisSegmentGroup[];
  factorWeights: FactorWeightItem[];
};

type GenerateAnalysisReportResult =
  | { available: false }
  | { available: true; report: AnalysisReport };

type FindActAnalysisItemsResult =
  | { available: false }
  | {
      available: true;
      items: ActAnalysisItem[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };

type FindActAnalysisSummaryResult =
  | { available: false }
  | {
      available: true;
      totalScore: number;
      positiveScore: number;
      negativeScore: number;
      absoluteScore: number;
      selfMonitoringBlocks: SelfMonitoringBlockSummary[];
    };

class ActAnalysisAdminService {
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
      skipDuplicates: true,
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

  private async resolveLatest(companyId: string, actChatbotId: string) {
    const analysis = await prismaClient.companyActAnalysis.findFirst({
      orderBy: { createdAt: "desc" },
      where: { companyId, actChatbotId },
      include: { companyActAnalysisBatches: true },
    });

    if (!analysis) {
      throw new PublicError("No act analysis for this company was found.");
    }

    const alreadySaved = analysis.companyActAnalysisBatches.every((batch) => batch.status === "completed");

    if (!alreadySaved) {
      const allDone = await this.retrieveAndSaveResults(analysis.companyActAnalysisBatches);

      if (!allDone) {
        return null;
      }
    }

    return analysis;
  }

  async generate(companyId: string, actChatbotId: string) {
    console.log(`Gerando análise para a empresa ${companyId} e o chatbot ${actChatbotId}`);

    const factors = await prismaClient.psychosocialFactor.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const chapters = await prismaClient.actChapter.findMany({
      where: {
        type: "REGULAR",
        actChatbot: {
          id: actChatbotId,
        },
        user: {
          companyId,
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
        companyId,
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

  private async queryRows(analysisId: string, filters: ActAnalysisFilters): Promise<ActAnalysisItem[]> {
    const gender = filters.gender ?? null;
    const area = filters.area ?? null;
    const location = filters.location ?? null;
    const search = filters.search ?? null;
    const occupation = filters.occupation ?? null;
    const occupationLevel = filters.occupationLevel ?? null;
    const skinColor = filters.skinColor ?? null;
    const hasDisability = filters.hasDisability ?? null;
    const nationalityId = filters.nationalityId ?? null;

    const rows = (await prismaClient.$queryRaw`
      WITH filtered AS (
        SELECT
          cab.company_act_analysis_id AS act_analysis_id,
          ampf.factor_id
        FROM act_messages_psychosocial_factors ampf

        JOIN company_act_analysis_batches cab
          ON cab.id = ampf.analysis_batch_id

        JOIN act_chapter_messages m
          ON m.id = ampf.message_id

        JOIN act_chapters c
          ON c.id = m.act_chapter_id

        JOIN users u
          ON u.id = c.user_id

        WHERE cab.company_act_analysis_id = ${analysisId}
          AND (${gender}::text IS NULL OR u.gender::text = ${gender})
          AND (${area}::text IS NULL OR u.area = ${area})
          AND (${location}::text IS NULL OR u.location = ${location})
          AND (${occupation}::text IS NULL OR u.occupation = ${occupation})
          AND (${occupationLevel}::text IS NULL OR u.occupation_level = ${occupationLevel})
          AND (${skinColor}::text IS NULL OR u.skin_color = ${skinColor})
          AND (${hasDisability}::boolean IS NULL OR u.has_disability = ${hasDisability}::boolean)
          AND (${nationalityId}::text IS NULL OR u.nationality_id = ${nationalityId})
      ),

      aggregated AS (
        SELECT
          act_analysis_id,
          factor_id,
          COUNT(*)::int AS total
        FROM filtered
        GROUP BY act_analysis_id, factor_id
      )

      SELECT
        a.factor_id,
        a.total,
        f.id as factor_id_full,
        f.name as factor_name,
        f.wheight as factor_wheight,
        smb.id as smb_id,
        smb.title as smb_title
      FROM aggregated a
      JOIN psychosocial_factors f ON f.id = a.factor_id
      LEFT JOIN self_monitoring_blocks smb ON f.self_monitoring_block_id = smb.id
      WHERE (${search}::text IS NULL OR f.name ILIKE '%' || ${search} || '%')
      ORDER BY a.total DESC
    `) as Array<{
      factor_id: string;
      total: number;
      factor_id_full: string;
      factor_name: string;
      factor_wheight: number;
      smb_id: string;
      smb_title: string;
    }>;

    return rows.map((r) => ({
      factor: {
        id: r.factor_id_full,
        name: r.factor_name,
        wheight: r.factor_wheight,
        weightedScore: r.factor_wheight * r.total,
      },
      selfMonitoringBlock: { id: r.smb_id, name: r.smb_title! },
      count: r.total,
    }));
  }

  async find(
    companyId: string,
    actChatbotId: string,
    filters: ActAnalysisFilters = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
  ): Promise<FindActAnalysisItemsResult> {
    console.log(`Buscando análise da empresa ${companyId} para o chatbot ${actChatbotId}`);

    const analysis = await this.resolveLatest(companyId, actChatbotId);

    if (!analysis) {
      return { available: false };
    }

    const allItems = await this.queryRows(analysis.id, filters);

    const { page, pageSize } = pagination;
    const total = allItems.length;
    const offset = (page - 1) * pageSize;
    const items = allItems.slice(offset, offset + pageSize);

    console.log(`Análise pronta com ${total} registros, retornando página ${page}`);

    return {
      available: true,
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findSummary(
    companyId: string,
    actChatbotId: string,
    filters: ActAnalysisFilters = {},
  ): Promise<FindActAnalysisSummaryResult> {
    const analysis = await this.resolveLatest(companyId, actChatbotId);

    if (!analysis) {
      return { available: false };
    }

    const items = await this.queryRows(analysis.id, filters);

    const totalScore = items.reduce((sum, item) => sum + item.factor.weightedScore, 0);

    const positiveScore = items
      .filter((item) => item.factor.wheight > 0)
      .reduce((sum, item) => sum + item.factor.weightedScore, 0);

    const negativeScore = items
      .filter((item) => item.factor.wheight <= 0)
      .reduce((sum, item) => sum + item.factor.weightedScore, 0);

    const blockMap = new Map<string, SelfMonitoringBlockSummary>();
    for (const item of items) {
      const { id, name } = item.selfMonitoringBlock;
      if (!blockMap.has(id)) {
        blockMap.set(id, { id, name, topFactors: [] });
      }
      blockMap.get(id)!.topFactors.push({
        id: item.factor.id,
        name: item.factor.name,
        wheight: item.factor.wheight,
        weightedScore: item.factor.weightedScore,
        count: item.count,
      });
    }

    for (const block of blockMap.values()) {
      block.topFactors.sort((a, b) => b.weightedScore - a.weightedScore);
    }

    return {
      available: true,
      totalScore,
      positiveScore,
      negativeScore,
      absoluteScore: positiveScore + Math.abs(negativeScore),
      selfMonitoringBlocks: Array.from(blockMap.values()),
    };
  }

  async findFactorMessages(companyId: string, actChatbotId: string, factorId: string) {
    const analysis = await this.resolveLatest(companyId, actChatbotId);

    if (!analysis) {
      return { available: false as const };
    }

    const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);

    const associations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        factorId,
        analysisBatchId: { in: batchIds },
      },
      include: {
        message: true,
      },
    });

    const messages = associations.map((a) => a.message);

    return { available: true as const, messages };
  }

  async findSegments(
    companyId: string,
    actChatbotId: string,
    column: UserGroupColumn,
    ranges?: RangeBucket[],
  ): Promise<FindActAnalysisSegmentsResult> {
    const analysis = await this.resolveLatest(companyId, actChatbotId);
    if (!analysis) return { available: false };

    const declarations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        message: { actChapter: { user: { companyId } } },
        analysisBatch: { companyActAnalysisId: analysis.id },
      },
      include: {
        message: { select: { actChapter: { select: { userId: true } } } },
        factor: { select: { wheight: true } },
      },
    });

    const includedUsers = await prismaClient.user.findMany({
      where: { id: { in: declarations.map((d) => d.message.actChapter.userId) } },
    });

    const userMap = new Map(includedUsers.map((u) => [u.id, u]));

    const resolveKey = (userId: string): string => {
      const user = userMap.get(userId);
      if (!user) return "null";

      if (column === "age") {
        if (!user.birthdate) return "null";
        const age = Math.floor((Date.now() - new Date(user.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (!ranges?.length) return String(age);
        // Intervalo fechado em min, aberto em max: [min, max). Ex: {min:18, max:30} captura 18–29.
        const bucket = ranges.find((r) => age >= r.min && age < r.max);
        return bucket?.label ?? "null";
      }

      // Para colunas string/enum/boolean, usa o valor bruto como chave. Ausente → "null".
      return String((user as Record<string, unknown>)[column] ?? "null");
    };

    // Cada declaração vira um wheight na lista do grupo correspondente ao valor da coluna do usuário.
    const byGroup = new Map<string, number[]>();
    for (const d of declarations) {
      const key = resolveKey(d.message.actChapter.userId);
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key)!.push(d.factor.wheight);
    }

    const groups: AnalysisSegmentGroup[] = [];
    for (const [key, wheights] of byGroup) {
      const positiveScore = wheights.filter((w) => w > 0).reduce((s, w) => s + w, 0);
      const negativeScore = wheights.filter((w) => w <= 0).reduce((s, w) => s + w, 0);
      const totalScore = positiveScore + negativeScore;
      const absoluteScore = positiveScore + Math.abs(negativeScore);
      const wellnessPercentage = absoluteScore > 0 ? (positiveScore / absoluteScore) * 100 : 0;
      groups.push({ value: key === "null" ? null : key, positiveScore, negativeScore, totalScore, absoluteScore, wellnessPercentage });
    }

    return { available: true, column, groups };
  }

  async findFactorWeights(
    companyId: string,
    actChatbotId: string,
  ): Promise<FindActAnalysisFactorWeightsResult> {
    const analysis = await this.resolveLatest(companyId, actChatbotId);
    if (!analysis) return { available: false };

    const declarations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        message: { actChapter: { user: { companyId } } },
        analysisBatch: { companyActAnalysisId: analysis.id },
      },
      include: {
        factor: { select: { id: true, name: true, wheight: true } },
        message: { select: { actChapter: { select: { userId: true } } } },
      },
    });

    const factorMap = new Map<string, { factor: (typeof declarations)[0]["factor"]; count: number }>();
    const userIds = new Set<string>();
    for (const d of declarations) {
      userIds.add(d.message.actChapter.userId);
      const entry = factorMap.get(d.factorId);
      if (entry) {
        entry.count++;
      } else {
        factorMap.set(d.factorId, { factor: d.factor, count: 1 });
      }
    }

    const factors: FactorWeightItem[] = Array.from(factorMap.values()).map(({ factor, count }) => ({
      id: factor.id,
      name: factor.name,
      wheight: factor.wheight,
      count,
      totalWeight: factor.wheight * count,
    }));

    return { available: true, factors, userCount: userIds.size };
  }

  async generateReport(
    companyId: string,
    actChatbotId: string,
  ): Promise<GenerateAnalysisReportResult> {
    const [byArea, byGender, byDisability, byOccupationLevel, byAgeRange, weightsResult] = await Promise.all([
      this.findSegments(companyId, actChatbotId, "area"),
      this.findSegments(companyId, actChatbotId, "gender"),
      this.findSegments(companyId, actChatbotId, "hasDisability"),
      this.findSegments(companyId, actChatbotId, "occupationLevel"),
      this.findSegments(companyId, actChatbotId, "age", [{ label: "60+", min: 60, max: Infinity }]),
      this.findFactorWeights(companyId, actChatbotId),
    ]);

    if (!byArea.available) return { available: false };

    const factorWeights = weightsResult.available ? weightsResult.factors : [];

    // Overall derivado dos factor weights — sem DB call extra
    const positiveScore = factorWeights.filter((f) => f.wheight > 0).reduce((s, f) => s + f.totalWeight, 0);
    const negativeScore = factorWeights.filter((f) => f.wheight <= 0).reduce((s, f) => s + f.totalWeight, 0);
    const totalScore = positiveScore + negativeScore;
    const absoluteScore = positiveScore + Math.abs(negativeScore);
    const overall: SegmentScores = {
      positiveScore,
      negativeScore,
      totalScore,
      absoluteScore,
      wellnessPercentage: absoluteScore > 0 ? (positiveScore / absoluteScore) * 100 : 0,
    };

    return {
      available: true,
      report: {
        userCount: weightsResult.available ? weightsResult.userCount : 0,
        overall,
        byArea: byArea.groups,
        byGender: byGender.available ? byGender.groups : [],
        byDisability: byDisability.available ? byDisability.groups : [],
        byOccupationLevel: byOccupationLevel.available ? byOccupationLevel.groups : [],
        byAgeRange: byAgeRange.available ? byAgeRange.groups : [],
        factorWeights,
      },
    };
  }
}

export { ActAnalysisAdminService };
export type {
  ActAnalysisFilters,
  FindActAnalysisItemsResult,
  FindActAnalysisSummaryResult,
  FindActAnalysisSegmentsResult,
  FindActAnalysisFactorWeightsResult,
  GenerateAnalysisReportResult,
  UserGroupColumn,
  RangeBucket,
  SegmentScores,
  AnalysisSegmentGroup,
  FactorWeightItem,
  AnalysisReport,
};
