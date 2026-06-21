import { ActAnalysisReport, CompanyActAnalysisBatch, MessageFactorAuthor, ReportStatus } from "@prisma/client";

import { PublicError } from "../../error";
import { OpenAiApi } from "../../external/openai";
import prismaClient from "../../prisma";
import { UpdateAnalysisReportRequest } from "../../schemas/admin/act-analysis";
import { UserService } from "../user/UserService";

// ── Analysis types ────────────────────────────────────────────────────────────

export const ANALYSIS_FILTER_COLUMNS = [
  "gender",
  "occupation",
  "occupationLevel",
  "area",
  "similarExposureGroup",
  "location",
  "skinColor",
  "hasDisability",
  "nationalityId",
] as const;

export type AnalysisFilterColumn = (typeof ANALYSIS_FILTER_COLUMNS)[number];

export interface ActAnalysisFilters {
  area?: string;
  gender?: string;
  hasDisability?: boolean;
  location?: string;
  nationalityId?: string;
  occupation?: string;
  occupationLevel?: string;
  search?: string;
  similarExposureGroup?: string;
  skinColor?: string;
}

interface ActAnalysisBatchResult {
  associations: { message_id: string; factor_id: string }[];
}

interface ActAnalysisItem {
  count: number;
  factor: { id: string; name: string; wheight: number; weightedScore: number };
  selfMonitoringBlock: { id: string; name: string };
}

interface SelfMonitoringBlockSummary {
  id: string;
  name: string;
  topFactors: Array<{ id: string; name: string; wheight: number; weightedScore: number; count: number }>;
}

export type UserGroupColumn =
  | "gender"
  | "area"
  | "similarExposureGroup"
  | "location"
  | "occupation"
  | "occupationLevel"
  | "skinColor"
  | "hasDisability"
  | "nationalityId"
  | "age";

export type RangeBucket = { label: string; min: number; max: number };

export type SegmentScores = {
  positiveScore: number;
  negativeScore: number;
  totalScore: number;
  absoluteScore: number;
  wellnessPercentage: number;
};

export type AnalysisSegmentGroup = SegmentScores & { value: string | null };

export type FindActAnalysisSegmentsResult =
  | { available: false }
  | { available: true; column: UserGroupColumn; groups: AnalysisSegmentGroup[] };

export type FactorWeightItem = { id: string; name: string; wheight: number; count: number; totalWeight: number };

export type FindActAnalysisFactorWeightsResult =
  | { available: false }
  | { available: true; factors: FactorWeightItem[]; userCount: number };

type AnalysisQuantitativeData = {
  overall: SegmentScores;
  bySimilarExposureGroup: AnalysisSegmentGroup[];
  byGender: AnalysisSegmentGroup[];
  byDisability: AnalysisSegmentGroup[];
  byOccupationLevel: AnalysisSegmentGroup[];
  byAgeRange: AnalysisSegmentGroup[];
  factorWeights: FactorWeightItem[];
};

export type AnalysisReport = AnalysisQuantitativeData & {
  id: string;
  companyName: string;
  evaluationPeriod: string | null;
  evaluationType: string | null;
  description: string | null;
  totalParticipants: number;
  technicalResponsible: string | null;
  professionalRegistration: string | null;
  issuedAt: Date | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  /** @deprecated use description */
  aiDescription: string | null;
  /** @deprecated use totalParticipants */
  userCount: number;
};

export type GenerateAnalysisReportResult = { available: false } | { available: true; report: AnalysisReport };

export type FindActAnalysisItemsResult =
  | { available: false }
  | { available: true; items: ActAnalysisItem[]; total: number; page: number; pageSize: number; totalPages: number };

export type FindActAnalysisSummaryResult =
  | { available: false }
  | {
      available: true;
      userCount: number;
      totalScore: number;
      positiveScore: number;
      negativeScore: number;
      absoluteScore: number;
      selfMonitoringBlocks: SelfMonitoringBlockSummary[];
    };

class ActAnalysisService {
  // ── Analysis private helpers ──────────────────────────────────────────────

  private async retrieveAndSaveAnalysisResults(storedBatches: CompanyActAnalysisBatch[]): Promise<boolean> {
    const openai = new OpenAiApi();
    const pendingBatches = storedBatches.filter((batch) => batch.status !== "completed");

    // Busca o status atual de cada batch pendente na OpenAI
    const batchResults = await Promise.all(
      pendingBatches.map((pending) => openai.retrieveBatchResult<ActAnalysisBatchResult>(pending.batchId)),
    );

    batchResults.forEach(({ batchId, status }) => {
      console.log(`lote OpenAI ${batchId} status=${status}`);
    });

    const newCompletedBatchResults = batchResults.filter((batchRes) => batchRes.status === "completed");
    const allDone = newCompletedBatchResults.length === pendingBatches.length;

    console.log(`batches concluídos nesta rodada: ${newCompletedBatchResults.length}/${pendingBatches.length}`);

    // Mapeia batchId externo (OpenAI) → id interno (CompanyActAnalysisBatch) para uso nos inserts
    const externalToLocalBatchId = pendingBatches.reduce((prev, curr) => {
      prev.set(curr.batchId, curr.id);
      return prev;
    }, new Map<string, string>());

    // Carrega todas as mensagens já processadas nesta análise (batches anteriores).
    // Isso impede que mensagens antigas — reenviadas à IA como contexto do capítulo —
    // sejam contadas novamente quando o capítulo tem mensagens novas.
    const analysisId = storedBatches[0]?.companyActAnalysisId;
    const processedMessageIds = new Set<string>();
    if (analysisId) {
      const processedRows = await prismaClient.actMessagesPsychosocialFactors.findMany({
        where: { analysisBatch: { companyActAnalysisId: analysisId } },
        select: { messageId: true },
      });
      processedRows.forEach((r) => processedMessageIds.add(r.messageId));
      console.log(`mensagens já processadas nesta análise: ${processedMessageIds.size}`);
    }

    // Extrai as associações positivas (mensagem → fator) retornadas pela IA,
    // filtrando apenas as mensagens novas (não presentes em processedMessageIds)
    const candidateAssociations = newCompletedBatchResults.flatMap(
      ({ results, batchId }) =>
        results?.flatMap(({ data }) =>
          data
            ? data.associations
                .filter((a) => !processedMessageIds.has(a.message_id))
                .map((a) => ({
                  factorId: a.factor_id,
                  messageId: a.message_id,
                  analysisBatchId: externalToLocalBatchId.get(batchId)!,
                  author: MessageFactorAuthor.AI,
                }))
            : [],
        ) ?? [],
    );

    // Valida que os message_ids retornados pela IA existem no banco
    // (a IA pode alucinar ids que não existem)
    const candidateMessageIds = [...new Set(candidateAssociations.map((a) => a.messageId))];
    const existingMessages = await prismaClient.actChapterMessage.findMany({
      where: { id: { in: candidateMessageIds } },
      select: { id: true },
    });
    const validMessageIds = new Set(existingMessages.map((m) => m.id));

    const invalidIds = candidateMessageIds.filter((id) => !validMessageIds.has(id));
    if (invalidIds.length > 0) {
      console.warn(`${invalidIds.length} message_id(s) retornados pela IA não existem no banco e serão ignorados`);
    }

    const validAssociations = candidateAssociations.filter((a) => validMessageIds.has(a.messageId));
    const associationMessageIds = new Set(validAssociations.map((a) => a.messageId));

    console.log(`associações válidas a inserir: ${validAssociations.length}`);

    // Para mensagens novas de usuário que a IA não associou a nenhum fator,
    // gravamos uma linha com factorId=null. Isso serve de marcador de "já processado":
    // na próxima geração incremental, essas mensagens estarão em processedMessageIds
    // e não serão enviadas para reprocessamento. As queries de report filtram factorId IS NOT NULL,
    // então essas linhas são invisíveis nos resultados.
    const chaptersInCompletedBatches = newCompletedBatchResults.flatMap(({ results, batchId }) =>
      (results ?? [])
        .filter((r) => r.customId !== null)
        .map((r) => ({ chapterId: r.customId as string, localBatchId: externalToLocalBatchId.get(batchId)! })),
    );

    const chapterIds = [...new Set(chaptersInCompletedBatches.map((r) => r.chapterId))];
    const chapterMessages = await prismaClient.actChapterMessage.findMany({
      where: { actChapterId: { in: chapterIds }, role: "user" },
      select: { id: true, actChapterId: true },
    });

    // Mapeia capítulo → batch local para saber em qual batch registrar o marcador null
    const chapterToBatchId = new Map(chaptersInCompletedBatches.map((r) => [r.chapterId, r.localBatchId]));

    const nullRows = chapterMessages
      .filter((m) => !processedMessageIds.has(m.id) && !associationMessageIds.has(m.id))
      .map((m) => ({
        messageId: m.id,
        factorId: null,
        analysisBatchId: chapterToBatchId.get(m.actChapterId)!,
        author: MessageFactorAuthor.AI,
      }));

    console.log(`marcadores null (mensagens sem fator): ${nullRows.length}`);

    await prismaClient.actMessagesPsychosocialFactors.createMany({
      data: [...validAssociations, ...nullRows],
      skipDuplicates: true,
    });

    await Promise.all(
      batchResults.map(({ batchId, status }) =>
        prismaClient.companyActAnalysisBatch.update({
          where: { id: externalToLocalBatchId.get(batchId)! },
          data: { status },
        }),
      ),
    );

    return allDone;
  }

  private async resolveLatestAnalysis(companyId: string, actChatbotId: string) {
    let analysis = await prismaClient.companyActAnalysis.findFirst({
      orderBy: { createdAt: "desc" },
      where: { companyId, actChatbotId },
      include: { companyActAnalysisBatches: true },
    });

    if (!analysis) throw new PublicError("No act analysis for this company was found.");

    const alreadySaved = analysis.companyActAnalysisBatches.every((batch) => batch.status === "completed");

    console.log(`resolveLatestAnalysis analysisId=${analysis.id} alreadySaved=${alreadySaved}`);

    if (!alreadySaved) {
      const allDone = await this.retrieveAndSaveAnalysisResults(analysis.companyActAnalysisBatches);
      console.log(`retrieveAndSaveAnalysisResults allDone=${allDone}`);
      if (!allDone) return null;

      const [totalParticipants, company] = await Promise.all([
        this.countAnalysisParticipants(analysis.id),
        prismaClient.company.findUniqueOrThrow({ where: { id: companyId }, select: { name: true } }),
      ]);
      await prismaClient.actAnalysisReport.create({
        data: { companyActAnalysisId: analysis.id, companyName: company.name, totalParticipants },
      });

      analysis = await prismaClient.companyActAnalysis.findFirst({
        orderBy: { createdAt: "desc" },
        where: { companyId, actChatbotId },
        include: { companyActAnalysisBatches: true },
      });
    }

    return analysis;
  }

  private async queryAnalysisRows(
    analysisId: string,
    filters: ActAnalysisFilters,
  ): Promise<{ items: ActAnalysisItem[]; userCount: number }> {
    const gender = filters.gender ?? null;
    const area = filters.area ?? null;
    const location = filters.location ?? null;
    const search = filters.search ?? null;
    const occupation = filters.occupation ?? null;
    const occupationLevel = filters.occupationLevel ?? null;
    const similarExposureGroup = filters.similarExposureGroup ?? null;
    const skinColor = filters.skinColor ?? null;
    const hasDisability = filters.hasDisability ?? null;
    const nationalityId = filters.nationalityId ?? null;

    const rows = (await prismaClient.$queryRaw`
      WITH filtered AS (
        SELECT
          cab.company_act_analysis_id AS act_analysis_id,
          ampf.factor_id,
          u.id AS user_id
        FROM act_messages_psychosocial_factors ampf
        JOIN company_act_analysis_batches cab ON cab.id = ampf.analysis_batch_id
        JOIN act_chapter_messages m ON m.id = ampf.message_id
        JOIN act_chapters c ON c.id = m.act_chapter_id
        JOIN users u ON u.id = c.user_id
        WHERE cab.company_act_analysis_id = ${analysisId}
          AND ampf.effective = true
          AND ampf.factor_id IS NOT NULL
          AND (${gender}::text IS NULL OR u.gender::text = ${gender})
          AND (${area}::text IS NULL OR u.area = ${area})
          AND (${location}::text IS NULL OR u.location = ${location})
          AND (${occupation}::text IS NULL OR u.occupation = ${occupation})
          AND (${occupationLevel}::text IS NULL OR u.occupation_level = ${occupationLevel})
          AND (${similarExposureGroup}::text IS NULL OR u.similar_exposure_group = ${similarExposureGroup})
          AND (${skinColor}::text IS NULL OR u.skin_color = ${skinColor})
          AND (${hasDisability}::boolean IS NULL OR u.has_disability = ${hasDisability}::boolean)
          AND (${nationalityId}::text IS NULL OR u.nationality_id = ${nationalityId})
      ),
      user_count AS (
        SELECT COUNT(DISTINCT user_id)::int AS cnt FROM filtered
      ),
      aggregated AS (
        SELECT act_analysis_id, factor_id, COUNT(*)::int AS total
        FROM filtered
        GROUP BY act_analysis_id, factor_id
      )
      SELECT
        a.factor_id, a.total,
        f.id as factor_id_full, f.name as factor_name, f.wheight as factor_wheight,
        smb.id as smb_id, smb.title as smb_title,
        (SELECT cnt FROM user_count) AS user_count
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
      user_count: number;
    }>;

    const userCount = rows[0]?.user_count ?? 0;
    const items = rows.map((r) => ({
      factor: {
        id: r.factor_id_full,
        name: r.factor_name,
        wheight: r.factor_wheight,
        weightedScore: r.factor_wheight * r.total,
      },
      selfMonitoringBlock: { id: r.smb_id, name: r.smb_title! },
      count: r.total,
    }));

    return { items, userCount };
  }

  private async findAnalysisSegments(
    companyId: string,
    actChatbotId: string,
    column: UserGroupColumn,
    ranges?: RangeBucket[] | null,
    valueMap?: Record<string, string | null>,
  ): Promise<FindActAnalysisSegmentsResult> {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis) return { available: false };

    const declarations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        effective: true,
        factorId: { not: null },
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
        const bucket = ranges.find((r) => age >= r.min && age < r.max);
        return bucket?.label ?? "null";
      }
      return String((user as Record<string, unknown>)[column] ?? "null");
    };

    const byGroup = new Map<string, number[]>();
    for (const d of declarations) {
      const key = resolveKey(d.message.actChapter.userId);
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key)!.push(d.factor!.wheight);
    }

    const groups: AnalysisSegmentGroup[] = [];
    for (const [key, wheights] of byGroup) {
      if (valueMap && key in valueMap && valueMap[key] === null) continue;
      const label = valueMap?.[key] ?? (key === "null" ? null : key);
      const positiveScore = wheights.filter((w) => w > 0).reduce((s, w) => s + w, 0);
      const negativeScore = wheights.filter((w) => w <= 0).reduce((s, w) => s + w, 0);
      const totalScore = positiveScore + negativeScore;
      const absoluteScore = positiveScore + Math.abs(negativeScore);
      const wellnessPercentage = absoluteScore > 0 ? (positiveScore / absoluteScore) * 100 : 0;
      groups.push({
        value: label,
        positiveScore,
        negativeScore,
        totalScore,
        absoluteScore,
        wellnessPercentage,
      });
    }

    return { available: true, column, groups };
  }

  private async findAnalysisFactorWeights(
    companyId: string,
    actChatbotId: string,
  ): Promise<FindActAnalysisFactorWeightsResult> {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis) return { available: false };

    const declarations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        effective: true,
        factorId: { not: null },
        message: { actChapter: { user: { companyId } } },
        analysisBatch: { companyActAnalysisId: analysis.id },
      },
      include: {
        factor: { select: { id: true, name: true, wheight: true } },
      },
    });

    const factorMap = new Map<string, { factor: (typeof declarations)[0]["factor"]; count: number }>();
    for (const d of declarations) {
      const entry = factorMap.get(d.factorId!);
      if (entry) {
        entry.count++;
      } else {
        factorMap.set(d.factorId!, { factor: d.factor, count: 1 });
      }
    }

    const [allFactors, userCount] = await Promise.all([
      prismaClient.psychosocialFactor.findMany({ select: { id: true, name: true, wheight: true } }),
      this.countAnalysisParticipants(analysis.id),
    ]);

    const factors: FactorWeightItem[] = allFactors.map((f) => {
      const entry = factorMap.get(f.id);
      const count = entry?.count ?? 0;
      return { id: f.id, name: f.name, wheight: f.wheight, count, totalWeight: f.wheight * count };
    });

    return { available: true, factors, userCount };
  }

  private async setReportStatus(reportId: string, status: ReportStatus): Promise<void> {
    await prismaClient.actAnalysisReport.update({ where: { id: reportId }, data: { status } });
  }

  private async resolveLatestReport(analysisId: string) {
    return prismaClient.actAnalysisReport.findFirst({
      where: { companyActAnalysisId: analysisId },
      orderBy: { createdAt: "desc" },
    });
  }

  private async countAnalysisParticipants(analysisId: string): Promise<number> {
    const declarations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: {
        effective: true,
        factorId: { not: null },
        analysisBatch: { companyActAnalysisId: analysisId },
      },
      select: { message: { select: { actChapter: { select: { userId: true } } } } },
    });
    return new Set(declarations.map((d) => d.message.actChapter.userId)).size;
  }

  // ── Analysis public methods ───────────────────────────────────────────────

  async findAnalysis(
    companyId: string,
    actChatbotId: string,
    filters: ActAnalysisFilters = {},
    pagination: { page: number; pageSize: number } = { page: 1, pageSize: 10 },
  ): Promise<FindActAnalysisItemsResult> {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis) return { available: false };

    const { items: allItems } = await this.queryAnalysisRows(analysis.id, filters);
    const { page, pageSize } = pagination;
    const total = allItems.length;
    const offset = (page - 1) * pageSize;
    const items = allItems.slice(offset, offset + pageSize);

    return { available: true, items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findAnalysisSummary(
    companyId: string,
    actChatbotId: string,
    filters: ActAnalysisFilters = {},
  ): Promise<FindActAnalysisSummaryResult> {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis) return { available: false };

    const { items, userCount } = await this.queryAnalysisRows(analysis.id, filters);

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
      if (!blockMap.has(id)) blockMap.set(id, { id, name, topFactors: [] });
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
      userCount,
      totalScore,
      positiveScore,
      negativeScore,
      absoluteScore: positiveScore + Math.abs(negativeScore),
      selfMonitoringBlocks: Array.from(blockMap.values()),
    };
  }

  async getAnalysisUserFilters(companyId: string, actChatbotId: string, columns: AnalysisFilterColumn[]) {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis) return { available: false as const };

    const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);

    const factorAssocs = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: { effective: true, factorId: { not: null }, analysisBatchId: { in: batchIds } },
      select: { message: { select: { actChapter: { select: { userId: true } } } } },
    });

    const userIds = [...new Set(factorAssocs.map((a) => a.message.actChapter.userId))];
    const filters = await new UserService().getFilters(columns, userIds);

    return { available: true as const, filters };
  }

  async findAnalysisFactorMessages(companyId: string, actChatbotId: string, factorId: string) {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis) return { available: false as const };

    const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);

    const associations = await prismaClient.actMessagesPsychosocialFactors.findMany({
      where: { effective: true, factorId, analysisBatchId: { in: batchIds } },
      include: { message: true },
    });

    return { available: true as const, associations };
  }

  async overrideFactorAssociations(overrides: { associationId: string; newFactorId: string | null }[]): Promise<void> {
    const existingIds = overrides.map((o) => o.associationId);

    await prismaClient.$transaction(async (tx) => {
      const existing = await tx.actMessagesPsychosocialFactors.findMany({
        where: { id: { in: existingIds } },
      });

      await tx.actMessagesPsychosocialFactors.createMany({
        data: existing.map((e) => {
          const override = overrides.find((o) => o.associationId === e.id)!;
          return {
            messageId: e.messageId,
            factorId: override.newFactorId,
            analysisBatchId: e.analysisBatchId,
            effective: true,
            author: MessageFactorAuthor.HUMAN,
            revision: e.revision + 1,
          };
        }),
      });

      await tx.actMessagesPsychosocialFactors.updateMany({
        where: { id: { in: existingIds } },
        data: { effective: false },
      });
    });
  }

  private async buildAnalysisReportData(
    companyId: string,
    actChatbotId: string,
  ): Promise<AnalysisQuantitativeData | null> {
    const [bySimilarExposureGroup, byGender, byDisability, byOccupationLevel, byAgeRange, weightsResult] =
      await Promise.all([
        this.findAnalysisSegments(companyId, actChatbotId, "similarExposureGroup"),
        this.findAnalysisSegments(companyId, actChatbotId, "gender", null, {
          MALE: "Masculino",
          FEMALE: "Feminino",
          OTHER: "Outros Gêneros",
        }),
        this.findAnalysisSegments(companyId, actChatbotId, "hasDisability", null, { true: "PcD", false: null }),
        this.findAnalysisSegments(companyId, actChatbotId, "occupationLevel"),
        this.findAnalysisSegments(companyId, actChatbotId, "age", [{ label: "60+", min: 60, max: Infinity }]),
        this.findAnalysisFactorWeights(companyId, actChatbotId),
      ]);

    // os segmentos chamam resolveLatestAnalysis internamente — se um retorna available: false (batches pendentes), todos retornariam; usamos esse como proxy
    console.log(`buildAnalysisReportData companyId=${companyId} available=${bySimilarExposureGroup.available}`);
    if (!bySimilarExposureGroup.available) return null;

    const factorWeights = weightsResult.available ? weightsResult.factors : [];
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
      overall,
      bySimilarExposureGroup: bySimilarExposureGroup.groups,
      byGender: byGender.available ? byGender.groups : [],
      byDisability: byDisability.available ? byDisability.groups : [],
      byOccupationLevel: byOccupationLevel.available ? byOccupationLevel.groups : [],
      byAgeRange: byAgeRange.available ? byAgeRange.groups : [],
      factorWeights,
    };
  }

  async getAnalysisReport(companyId: string, actChatbotId: string): Promise<GenerateAnalysisReportResult> {
    const latestAnalysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!latestAnalysis) return { available: false };

    let latestReport = await this.resolveLatestReport(latestAnalysis.id);
    if (!latestReport) {
      // Regra de transição: análises que completaram antes da tabela act_analysis_reports existir
      // não têm report associado. A análise está completa aqui (resolveLatestAnalysis retorna null
      // enquanto batches pendentes), então criamos o report on-demand.
      // TODO: remover quando não houver mais análises sem report associado.
      const [totalParticipants, company] = await Promise.all([
        this.countAnalysisParticipants(latestAnalysis.id),
        prismaClient.company.findUniqueOrThrow({ where: { id: companyId }, select: { name: true } }),
      ]);
      latestReport = await prismaClient.actAnalysisReport.create({
        data: { companyActAnalysisId: latestAnalysis.id, companyName: company.name, totalParticipants },
      });
    }

    // GENERATING: outra requisição já está gerando o laudo — retorna indisponível para evitar geração dupla.
    // PENDING: batches concluíram mas o texto AI ainda não foi gerado — ocupa o estado GENERATING como lock
    // otimista, gera de forma síncrona, e reverte para PENDING se der erro para permitir nova tentativa.
    // READY: laudo em dia, passa direto.
    switch (latestReport.status) {
      case ReportStatus.GENERATING:
        return { available: false };

      case ReportStatus.PENDING:
        await this.setReportStatus(latestReport.id, ReportStatus.GENERATING);
        try {
          await this.generateReportDescription(companyId, actChatbotId, latestAnalysis, latestReport);
        } catch (error) {
          await this.setReportStatus(latestReport.id, ReportStatus.PENDING);
          throw error;
        }
        latestReport = await prismaClient.actAnalysisReport.findUniqueOrThrow({ where: { id: latestReport.id } });
        break;

      default:
        break;
    }

    const quantData = await this.buildAnalysisReportData(companyId, actChatbotId);
    if (!quantData) return { available: false };

    const { companyActAnalysisId: _, ...report } = latestReport;
    return {
      available: true,
      report: {
        ...report,
        ...quantData,
        aiDescription: report.description ?? "O laudo qualitativo para esse ato ainda não foi gerado.",
        userCount: report.totalParticipants,
      },
    };
  }

  async regenerateAnalysisReport(companyId: string, actChatbotId: string): Promise<GenerateAnalysisReportResult> {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis)
      throw new PublicError("A análise ainda está sendo processada. Por favor, tente novamente em alguns instantes.");

    const latestReport = await this.resolveLatestReport(analysis.id);

    // Força nova geração: volta para PENDING e delega ao fluxo síncrono do getAnalysisReport
    // Se não houver report (análise histórica), getAnalysisReport cria on-demand e gera direto.
    if (latestReport) await this.setReportStatus(latestReport.id, ReportStatus.PENDING);
    return this.getAnalysisReport(companyId, actChatbotId);
  }

  async updateAnalysisReport(
    companyId: string,
    actChatbotId: string,
    data: UpdateAnalysisReportRequest,
  ): Promise<ActAnalysisReport> {
    const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
    if (!analysis)
      throw new PublicError("A análise ainda está sendo processada. Por favor, tente novamente em alguns instantes.");

    const latestReport = await this.resolveLatestReport(analysis.id);
    if (!latestReport) throw new PublicError("Nenhum laudo encontrado para esta análise.");

    return prismaClient.actAnalysisReport.update({
      where: { id: latestReport.id },
      data,
    });
  }

  private async generateReportDescription(
    companyId: string,
    actChatbotId: string,
    analysis: { id: string },
    report: { id: string; totalParticipants: number },
  ): Promise<void> {
    const quantData = await this.buildAnalysisReportData(companyId, actChatbotId);
    if (!quantData) {
      console.log(`batches ainda pendentes para analysisId=${analysis.id}, pulando geração de descrição`);
      return;
    }

    console.log(`gerando descrição para analysisId=${analysis.id}`);
    try {
      const actChatbot = await prismaClient.actChatbot.findUniqueOrThrow({
        where: { id: actChatbotId },
      });

      const openAiApi = new OpenAiApi({ model: "gpt-5.4" });

      const reportText = this.buildReportText(actChatbot, quantData, report.totalParticipants);
      const response = await openAiApi.generateResponse({
        messages: [{ role: "user", content: reportText }],
        instructions: actChatbot.reportGenerationInstructions,
      });
      console.log(`descrição gerada (${response.output_text.length} chars)`);

      await prismaClient.actAnalysisReport.update({
        where: { id: report.id },
        data: { description: response.output_text, status: ReportStatus.READY },
      });

      await this.createReportRag(actChatbotId, analysis, report, reportText, response.output_text);
    } catch (error) {
      throw new Error(`falha ao gerar descrição para analysisId=${analysis.id}: ${error}`);
    }
  }

  private async createReportRag(
    actChatbotId: string,
    analysis: { id: string },
    report: { id: string },
    reportText: string,
    // TODO: considerar persistir reportText no banco para desacoplar createReportRag de generateReportDescription
    reportDescription: string,
  ): Promise<void> {
    const actChatbot = await prismaClient.actChatbot.findUniqueOrThrow({
      where: { id: actChatbotId },
    });

    const openAiApi = new OpenAiApi({ model: "gpt-5.4" });
    const fullRagContent = `${reportText}\n\n${reportDescription}\n\n${actChatbot.description}`;

    const { dbVectorStore } = await openAiApi.createVectorStoreWithContent({
      storeName: `analysis-act-${actChatbotId}`,
      content: fullRagContent,
      filename: "act-analysis.md",
    });

    await prismaClient.companyActAnalysis.update({
      where: { id: analysis.id },
      data: { vectorStoreId: dbVectorStore.id },
    });

    console.log(`RAG criado para reportId=${report.id} analysisId=${analysis.id} vectorStoreId=${dbVectorStore.id}`);
  }

  private buildReportText(
    actChatbot: { name: string },
    report: AnalysisQuantitativeData,
    totalParticipants: number,
  ): string {
    const classify = (wellnessPercentage: number): string => {
      const w = wellnessPercentage;
      const r = 100 - w;
      if (w >= 80 && r <= 20) return "🟢 Florescimento";
      if (w >= 60 && r <= 40) return "🟢 Saudável";
      if (r > 60 && w < 40) return "🔴 Risco Psicossocial";
      if (r >= 80 && w <= 20) return "🔴 Zona Crítica";
      return "🟡 Estagnação";
    };

    const score = Math.round(report.overall.wellnessPercentage);
    const riskIndex = Math.round(100 - score);
    const overallClassification = classify(report.overall.wellnessPercentage);

    const riskFactors = report.factorWeights.filter((f) => f.wheight < 0).sort((a, b) => b.count - a.count);

    const wellbeingFactors = report.factorWeights.filter((f) => f.wheight > 0).sort((a, b) => b.count - a.count);

    const factorTable = (factors: FactorWeightItem[]) =>
      factors.map((f, i) => `| ${i + 1} | ${f.name} | ${f.count} |`).join("\n");

    const segmentTable = (groups: AnalysisSegmentGroup[]) =>
      groups
        .filter((g) => g.value !== null)
        .sort((a, b) => b.wellnessPercentage - a.wellnessPercentage)
        .map((g) => {
          const bem = Math.round(g.positiveScore);
          const risco = Math.round(Math.abs(g.negativeScore));
          const idx = Math.round(g.wellnessPercentage);
          return `| ${g.value} | ${bem} | ${risco} | ${idx} | ${classify(g.wellnessPercentage)} |`;
        })
        .join("\n");

    const segmentSection = (title: string, groups: AnalysisSegmentGroup[]) => {
      const rows = segmentTable(groups);
      if (!rows) return null;
      return [
        `## ${title}`,
        ``,
        `| Nome | Bem-Estar | Risco | Índice | Classificação |`,
        `|------|-----------|-------|--------|---------------|`,
        rows,
      ].join("\n");
    };

    const segments = [
      segmentSection("COMPARAÇÃO POR GÊNERO", report.byGender),
      segmentSection("COMPARAÇÃO POR GHE", report.bySimilarExposureGroup),
      segmentSection("COMPARAÇÃO POR NÍVEL DE CARGO", report.byOccupationLevel),
      segmentSection("COMPARAÇÃO POR FAIXA ETÁRIA", report.byAgeRange),
      segmentSection("COMPARAÇÃO POR PcD", report.byDisability),
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");

    const reportText = [
      `# ATO`,
      `**${actChatbot.name} — ${new Date().getFullYear()}**`,
      ``,
      `---`,
      ``,
      `## INFORMAÇÕES TÉCNICAS`,
      ``,
      `**PARTICIPANTES**`,
      `${totalParticipants}`,
      ``,
      `**TIPO DE AVALIAÇÃO**`,
      `Ato`,
      ``,
      `---`,
      ``,
      `## RESUMO EXECUTIVO — ÍNDICE GERAL DA EMPRESA`,
      ``,
      `**ZUMIRA SCORE: ${score} / 100 — ${overallClassification.replace(/^[^ ]+ /, "")}**`,
      ``,
      `| | |`,
      `|---|---|`,
      `| **RISCOS PRIORITÁRIOS** | **FORÇAS ORGANIZACIONAIS** |`,
      `| **${riskIndex}** — índice de risco psicossocial | **${score}%** — índice de bem-estar organizacional |`,
      ``,
      `---`,
      ``,
      `## RANKING DE RISCO PSICOSSOCIAL`,
      ``,
      `| Nº | Fator | Valor |`,
      `|----|-------|-------|`,
      factorTable(riskFactors),
      ``,
      `---`,
      ``,
      `## RANKING DE BEM-ESTAR NO TRABALHO`,
      ``,
      `| Nº | Fator | Valor |`,
      `|----|-------|-------|`,
      factorTable(wellbeingFactors),
      ``,
      `---`,
      ``,
      segments,
    ].join("\n");

    return reportText;
  }
}

export { ActAnalysisService };
