import { ChapterType, CompanyActAnalysisBatch, MessageFactorAuthor, Prisma } from "@prisma/client";

import { PublicError } from "../../error";
import { GenerateOpenAiResponseRequest, OpenAiApi } from "../../external/openai";
import { ReceiveMessage, WhatsappApi } from "../../external/whatsapp";
import prismaClient from "../../prisma";
import {
  CompileActChapterRequest,
  CreateActChapterRequest,
  GetActChapterRequest,
  MessageActChatbotRequest,
  UpdateActChapterRequest,
} from "../../schemas/actChatbot";
import { tryParsePhone } from "../../utils/phone";
import { capitalize } from "../../utils/string";
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

export type AnalysisReport = {
  userCount: number;
  overall: SegmentScores;
  bySimilarExposureGroup: AnalysisSegmentGroup[];
  byGender: AnalysisSegmentGroup[];
  byDisability: AnalysisSegmentGroup[];
  byOccupationLevel: AnalysisSegmentGroup[];
  byAgeRange: AnalysisSegmentGroup[];
  factorWeights: FactorWeightItem[];
  aiDescription: string;
};

export type GenerateAnalysisReportResult = { available: false } | { available: true; report: AnalysisReport };

export type FindActAnalysisItemsResult =
  | { available: false }
  | { available: true; items: ActAnalysisItem[]; total: number; page: number; pageSize: number; totalPages: number };

export type FindActAnalysisSummaryResult =
  | { available: false }
  | {
      available: true;
      totalScore: number;
      positiveScore: number;
      negativeScore: number;
      absoluteScore: number;
      selfMonitoringBlocks: SelfMonitoringBlockSummary[];
    };

function getProgress(
  bots: { id: string; name: string; description: string; icon: string; index: number }[],
  chapters: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    compilation: string | null;
    actChatbotId: string;
  }[],
) {
  const _bots = [...bots].sort((a, b) => a.index - b.index);

  let completedActs = 0;
  for (const bot of _bots) {
    if (chapters.find((chapter) => chapter.actChatbotId === bot.id && !!chapter.compilation)) {
      completedActs += 1;
    } else {
      break;
    }
  }

  return completedActs / _bots.length;
}

class ActService {
  async compileChapter({ actChapterId, userId }: CompileActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({
      where: { userId, id: actChapterId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        actChatbot: true,
      },
    });
    if (!chapter) throw new Error("Chapter not found");

    const messages = chapter.messages.map((m) => ({
      content: m.content,
      role: "user",
    })) as GenerateOpenAiResponseRequest["messages"];

    const openai = new OpenAiApi();
    const response = await openai.generateResponse({
      messages,
      instructions: chapter.actChatbot.compilationInstructions,
    });

    const data = await prismaClient.actChapter.update({
      where: { id: actChapterId },
      data: { compilation: response.output_text },
    });

    return data;
  }

  async createChapter(data: CreateActChapterRequest) {
    await prismaClient.actChapter.deleteMany({
      where: { userId: data.userId, messages: { none: {} } },
    });

    const chapter = await prismaClient.actChapter.create({
      data,
      select: {
        id: true,
        actChatbot: {
          select: { name: true, icon: true, description: true },
        },
      },
    });

    return chapter;
  }

  async getChapter({ userId, actChapterId }: GetActChapterRequest) {
    const [chapter, messages] = await Promise.all([
      prismaClient.actChapter.findFirst({
        where: { id: actChapterId },
        select: {
          id: true,
          title: true,
          compilation: true,
          actChatbot: {
            select: { id: true, description: true, icon: true, name: true, initialMessage: true },
          },
        },
      }),
      prismaClient.actChapterMessage.findMany({
        where: { actChapterId, actChapter: { userId } },
        select: { content: true, role: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    if (!chapter) throw new Error("Chapter not found");

    return { ...chapter, messages };
  }

  async list(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) throw new PublicError("Usuário não encontrado");

    const [chatbots, chapters] = await Promise.all([
      prismaClient.actChatbot.findMany({
        where: { trailId: user.company?.trailId },
        select: { id: true, name: true, description: true, icon: true, index: true },
        orderBy: { index: "asc" },
      }),
      prismaClient.actChapter.findMany({
        where: {
          userId,
          type: "REGULAR",
          actChatbot: { trailId: user.company?.trailId },
        },
        select: {
          id: true,
          title: true,
          actChatbotId: true,
          compilation: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const progress = getProgress(chatbots, chapters);

    let currAct = chatbots.find((bot) => bot.id === user.currentActChatbotId);
    if (!currAct) {
      if (!chatbots.length) return { chatbots: [], chapters: [] };

      currAct = chatbots[0];
      await prismaClient.user.update({ where: { id: userId }, data: { currentActChatbotId: currAct?.id } });
    }

    const processedChatbots = chatbots.map((bot) => ({
      ...bot,
      locked: bot.index > currAct.index,
      current: bot.id === currAct.id,
    }));

    const processedChapters = chapters.map((chapter) => {
      const { compilation: _, ...formatted } = chapter;
      return formatted;
    });

    return { chatbots: processedChatbots, chapters: processedChapters, progress };
  }

  async getFullStory(userId: string) {
    const user = await prismaClient.user.findFirst({ where: { id: userId }, select: { company: true } });

    if (!user) throw new PublicError("Usuário não encontrado");

    const chapters = await prismaClient.actChapter.findMany({
      where: {
        userId,
        type: "REGULAR",
        compilation: { not: null },
        actChatbot: { trailId: user.company?.trailId },
      },
      select: {
        id: true,
        title: true,
        compilation: true,
        createdAt: true,
        updatedAt: true,
        actChatbot: { select: { index: true, name: true } },
      },
    });

    return { chapters };
  }

  async message(
    { content, actChapterId, userId }: MessageActChatbotRequest,
    opts?: { externalId?: string; instructionsComplement?: string },
  ) {
    const conv = await prismaClient.actChapter.findFirst({
      where: { id: actChapterId, userId },
      include: { actChatbot: true, user: true },
    });

    if (!conv) throw new PublicError("Conversa não existe");

    await prismaClient.actChapterMessage.create({
      data: { actChapterId, role: "user", content, externalId: opts?.externalId },
    });

    const { actChatbot: bot } = conv;
    const messages = await prismaClient.actChapterMessage.findMany({
      where: { actChapterId },
      orderBy: { createdAt: "asc" },
    });

    const historyAndInput = messages.map((m) => ({
      role: m.role,
      content: m.content,
    })) as GenerateOpenAiResponseRequest["messages"];

    if (conv.actChatbot.initialMessage)
      historyAndInput.unshift({ role: "assistant", content: conv.actChatbot.initialMessage });

    const openai = new OpenAiApi();
    const response = await openai.generateResponse({
      instructions: [
        bot.messageInstructions,
        `O nome do usuário é: ${capitalize(conv.user.name.split(" ")[0])}`,
        opts?.instructionsComplement,
      ]
        .filter(Boolean)
        .join("\n"),
      messages: historyAndInput,
    });

    await Promise.all([
      prismaClient.actChapterMessage.create({
        data: { actChapterId, role: "assistant", content: response.output_text },
      }),
      prismaClient.actChapter.update({
        where: { id: actChapterId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return response.output_text;
  }

  async moveToNext(userId: string): Promise<{ currActChatbotId: string }> {
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: { currentActChatbot: true, company: true },
    });

    if (!user) throw new PublicError("Usuário não encontrado");
    if (!user.currentActChatbot) throw new PublicError("Usuário não está atribuído a nenhum ato");

    const trailId = user.company?.trailId;

    const currentActMessages = await prismaClient.actChapterMessage.findMany({
      where: { actChapter: { userId, actChatbotId: user.currentActChatbot.id } },
    });

    if (!currentActMessages.length) throw new PublicError("Usuário não iniciou o ato atual");

    const nextAct = await prismaClient.actChatbot.findFirst({
      where: { trailId, index: user.currentActChatbot.index + 1 },
    });

    if (!nextAct) return { currActChatbotId: user.currentActChatbot.id };

    await prismaClient.user.update({
      where: { id: userId },
      data: { currentActChatbotId: nextAct.id },
    });

    return { currActChatbotId: nextAct.id };
  }

  async updateChapter({ userId, actChapterId, compilation, title }: UpdateActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({ where: { id: actChapterId, userId } });

    if (!chapter) throw new Error("Chapter not found");

    const result = await prismaClient.actChapter.update({
      where: { id: actChapterId, userId },
      data: { compilation, title },
    });

    return result;
  }

  // ── ActChatbot methods ────────────────────────────────────────────────────

  async findById(id: string) {
    const bot = await prismaClient.actChatbot.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        initialMessage: true,
        messageInstructions: true,
        compilationInstructions: true,
        index: true,
        trailId: true,
      },
    });
    return bot;
  }

  async findByCompany(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: { id: companyId },
      select: { trailId: true },
    });

    if (!company) throw new PublicError("Company not found");

    const actListSelect = {
      id: true,
      name: true,
      description: true,
      icon: true,
      index: true,
      trailId: true,
      createdAt: true,
    } satisfies Prisma.ActChatbotSelect;

    const bots = await prismaClient.actChatbot.findMany({
      select: actListSelect,
      where: { trailId: company.trailId },
      orderBy: { index: "asc" },
    });

    return { items: bots };
  }

  // ── Analysis private helpers ──────────────────────────────────────────────

  private async retrieveAndSaveAnalysisResults(storedBatches: CompanyActAnalysisBatch[]): Promise<boolean> {
    const openai = new OpenAiApi();
    const pendingBatches = storedBatches.filter((batch) => batch.status !== "completed");

    const batchResults = await Promise.all(
      pendingBatches.map((pending) => openai.retrieveBatchResult<ActAnalysisBatchResult>(pending.batchId)),
    );

    batchResults.forEach(({ batchId, status }) => {
      console.log(`Lote OpenAI ${batchId} retornou status ${status}`);
    });

    const newCompletedBatchResults = batchResults.filter((batchRes) => batchRes.status === "completed");
    const allDone = newCompletedBatchResults.length === pendingBatches.length;

    const externalToLocalBatchId = pendingBatches.reduce((prev, curr) => {
      prev.set(curr.batchId, curr.id);
      return prev;
    }, new Map<string, string>());

    const candidateAssociations = newCompletedBatchResults.flatMap(
      ({ results, batchId }) =>
        results?.flatMap(({ data }) =>
          data
            ? data.associations.map((a) => ({
                factorId: a.factor_id,
                messageId: a.message_id,
                analysisBatchId: externalToLocalBatchId.get(batchId)!,
                author: MessageFactorAuthor.AI,
              }))
            : [],
        ) ?? [],
    );

    const candidateMessageIds = [...new Set(candidateAssociations.map((a) => a.messageId))];
    const existingMessages = await prismaClient.actChapterMessage.findMany({
      where: { id: { in: candidateMessageIds } },
      select: { id: true },
    });
    const validMessageIds = new Set(existingMessages.map((m) => m.id));

    const invalidIds = candidateMessageIds.filter((id) => !validMessageIds.has(id));
    if (invalidIds.length > 0) {
      console.warn(
        `[ActService] ${invalidIds.length} message_id(s) retornados pela IA não existem no banco e serão ignorados:`,
        invalidIds,
      );
    }

    await prismaClient.actMessagesPsychosocialFactors.createMany({
      data: candidateAssociations.filter((a) => validMessageIds.has(a.messageId)),
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

    console.log(
      `[act/analysis] resolveLatestAnalysis analysisId=${analysis.id} alreadySaved=${alreadySaved} batches=${JSON.stringify(analysis.companyActAnalysisBatches.map((b) => ({ id: b.id, status: b.status })))}`,
    );

    if (!alreadySaved) {
      const allDone = await this.retrieveAndSaveAnalysisResults(analysis.companyActAnalysisBatches);
      console.log(`[act/analysis] retrieveAndSaveAnalysisResults allDone=${allDone}`);
      if (!allDone) return null;

      console.log(`[act/analysis] calling generateAnalysisReportRag for analysisId=${analysis.id}`);
      await this.generateAnalysisReportRag(companyId, actChatbotId, analysis);

      analysis = await prismaClient.companyActAnalysis.findFirst({
        orderBy: { createdAt: "desc" },
        where: { companyId, actChatbotId },
        include: { companyActAnalysisBatches: true },
      });
    }

    return analysis;
  }

  private async queryAnalysisRows(analysisId: string, filters: ActAnalysisFilters): Promise<ActAnalysisItem[]> {
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
          AND (${skinColor}::text IS NULL OR u.skin_color = ${skinColor})
          AND (${hasDisability}::boolean IS NULL OR u.has_disability = ${hasDisability}::boolean)
          AND (${nationalityId}::text IS NULL OR u.nationality_id = ${nationalityId})
      ),
      aggregated AS (
        SELECT act_analysis_id, factor_id, COUNT(*)::int AS total
        FROM filtered
        GROUP BY act_analysis_id, factor_id
      )
      SELECT
        a.factor_id, a.total,
        f.id as factor_id_full, f.name as factor_name, f.wheight as factor_wheight,
        smb.id as smb_id, smb.title as smb_title
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
        message: { select: { actChapter: { select: { userId: true } } } },
      },
    });

    const factorMap = new Map<string, { factor: (typeof declarations)[0]["factor"]; count: number }>();
    const userIds = new Set<string>();
    for (const d of declarations) {
      userIds.add(d.message.actChapter.userId);
      const entry = factorMap.get(d.factorId!);
      if (entry) {
        entry.count++;
      } else {
        factorMap.set(d.factorId!, { factor: d.factor, count: 1 });
      }
    }

    const allFactors = await prismaClient.psychosocialFactor.findMany({
      select: { id: true, name: true, wheight: true },
    });

    const factors: FactorWeightItem[] = allFactors.map((f) => {
      const entry = factorMap.get(f.id);
      const count = entry?.count ?? 0;
      return { id: f.id, name: f.name, wheight: f.wheight, count, totalWeight: f.wheight * count };
    });

    return { available: true, factors, userCount: userIds.size };
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

    const allItems = await this.queryAnalysisRows(analysis.id, filters);
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

    const items = await this.queryAnalysisRows(analysis.id, filters);

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
  ): Promise<Omit<AnalysisReport, "aiDescription"> | null> {
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
    console.log(
      `[act/analysis] buildAnalysisReportData companyId=${companyId} actChatbotId=${actChatbotId} bySimilarExposureGroup.available=${bySimilarExposureGroup.available}`,
    );
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
      userCount: weightsResult.available ? weightsResult.userCount : 0,
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

    const report = await this.buildAnalysisReportData(companyId, actChatbotId);
    if (!report) return { available: false };

    return {
      available: true,
      report: {
        ...report,
        aiDescription: latestAnalysis?.text ?? "O laudo qualitativo para esse ato ainda não foi gerado.",
      },
    };
  }

  private async generateAnalysisReportRag(
    companyId: string,
    actChatbotId: string,
    analysis: { id: string },
  ): Promise<void> {
    const report = await this.buildAnalysisReportData(companyId, actChatbotId);
    if (!report) {
      console.log(
        `[RAG/act] buildAnalysisReportData returned null for analysisId=${analysis.id} — batches still pending, skipping RAG`,
      );
      return;
    }

    console.log(`[RAG/act] starting RAG setup for analysis ${analysis.id} (actChatbotId: ${actChatbotId})`);
    try {
      const actChatbot = await prismaClient.actChatbot.findUniqueOrThrow({
        where: { id: actChatbotId },
      });

      const openAiApi = new OpenAiApi({ model: "gpt-5.4" });

      console.log(`[RAG/act] generating RAG response from report`);
      const { response: ragResponse, reportText } = await this.buildActRagResponse(actChatbot, report, openAiApi);
      console.log(`[RAG/act] RAG response generated (${ragResponse.output_text.length} chars)`);

      const fullRagContent = `${reportText}\n\n${ragResponse.output_text}\n\n${actChatbot.description}`;

      const { dbVectorStore } = await openAiApi.createVectorStoreWithContent({
        storeName: `analysis-act-${actChatbotId}`,
        content: fullRagContent,
        filename: "act-analysis.md",
      });

      await prismaClient.companyActAnalysis.update({
        where: { id: analysis.id },
        data: { text: ragResponse.output_text, vectorStoreId: dbVectorStore.id } as object,
      });

      console.log(`[RAG/act] analysis ${analysis.id} updated with vectorStoreId=${dbVectorStore.id}`);

      const saved = await prismaClient.companyActAnalysis.findFirst({
        orderBy: { createdAt: "desc" },
        where: { companyId, actChatbotId },
        select: { id: true, vectorStoreId: true, text: true },
      });
      console.log(
        `[RAG/act] verify after update: id=${saved?.id} vectorStoreId=${saved?.vectorStoreId} hasText=${!!saved?.text}`,
      );
    } catch (error) {
      throw new Error(`[RAG/act] failed to create RAG for analysis ${analysis.id}: ${error}`);
    }
  }

  private async buildActRagResponse(
    actChatbot: { name: string; reportInstructions: string | null },
    report: Omit<AnalysisReport, "aiDescription">,
    openAiApi: OpenAiApi,
  ) {
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
      `${report.userCount}`,
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

    const response = await openAiApi.generateResponse({
      messages: [{ role: "user", content: reportText }],
      instructions: actChatbot.reportInstructions,
    });

    return { response, reportText };
  }

  private async assignFirstActToUser(userId: string, companyId: string | null): Promise<string | null> {
    let trailId: string | undefined;

    if (companyId) {
      const company = await prismaClient.company.findUnique({
        where: { id: companyId },
        select: { trailId: true },
      });
      trailId = company?.trailId;
    }

    const firstAct = await prismaClient.actChatbot.findFirst({
      where: { trailId },
      orderBy: { index: "asc" },
      select: { id: true },
    });

    if (!firstAct) return null;

    console.log(
      `[ActService] auto-assigning actChatbot ${firstAct.id} to user ${userId} (companyId: ${companyId ?? "none"})`,
    );
    await prismaClient.user.update({
      where: { id: userId },
      data: { currentActChatbotId: firstAct.id },
    });

    return firstAct.id;
  }

  async handleWhatsappMessage(message: ReceiveMessage, api: WhatsappApi): Promise<void> {
    const from = message.from.startsWith("+") ? message.from : `+${message.from}`;
    const phoneE164 = tryParsePhone(from)?.format("E.164") ?? message.from;

    const user = await prismaClient.user.findFirst({
      where: { phoneNumber: phoneE164 },
    });

    if (!user) {
      console.log(`[WhatsApp] no user found for phone ${phoneE164}, sending registration message`);
      await api.send({
        to: message.from,
        message:
          "Olá! Não identifiquei seu cadastro. Pode ser que seu número ainda não esteja em nossos registros ou esteja desatualizado. Para continuar, entre em contato com a sua empresa. Obrigada",
      });
      return;
    }

    if (!user.currentActChatbotId) {
      const assignedActId = await this.assignFirstActToUser(user.id, user.companyId);
      if (!assignedActId) {
        console.log(`[WhatsApp] no act available to assign to user ${user.email} (${user.id})`);
        await api.send({
          to: message.from,
          message:
            "Olá! Não identifiquei nenhum Ato ou Pesquisa atribuída ao seu cadastro. Pode ser que a pesquisa já tenha sido finalizada ou ainda não foi iniciada. Entre em contato com a sua empresa para mais informações. Obrigada",
        });
        return;
      }
      user.currentActChatbotId = assignedActId;
    }

    // rollback: trocar condição por `message.messageType !== "text"` e restaurar mensagem "Não é possível enviar mensagens de voz. Por favor, envie uma mensagem de texto."
    if (message.messageType !== "text" && message.messageType !== "audio") {
      await api.send({
        to: message.from,
        message: "Não é possível enviar este tipo de mensagem. Por favor, envie uma mensagem de texto ou áudio de voz.",
      });
      return;
    }

    const actChatbotId = user.currentActChatbotId!;

    console.log(`Identified user: ${user.email} (${user.id})`);

    const existingChapter = await prismaClient.actChapter.findFirst({
      where: { userId: user.id, actChatbotId, type: ChapterType.WHATSAPP },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    const chapterId =
      existingChapter?.id ??
      (
        await this.createChapter({
          actChatbotId,
          type: ChapterType.WHATSAPP,
          userId: user.id,
        })
      ).id;

    console.log(`Resolved chapter: ${chapterId}`);

    if (message.externalId !== "ABGGFlA5Fpa") {
      const alreadyProcessed = await prismaClient.actChapterMessage.findFirst({
        where: { actChapterId: chapterId, externalId: message.externalId },
        select: { id: true },
      });

      if (alreadyProcessed) {
        console.log(`[WhatsApp] message ${message.externalId} already processed, skipping`);
        return;
      }
    } else {
      console.log("Test webhook message id detected. Skipping duplicate verification.");
    }

    await Promise.all([api.markAsRead(message.externalId), api.sendTyping(message.from)]);

    // rollback: remover este bloco inteiro (let messageContent + if "audio") e trocar messageContent por message.message na chamada this.message() abaixo
    let messageContent = message.message;

    if (message.messageType === "audio") {
      if (!message.audioId) {
        console.log(`[WhatsApp] audio message without audioId from ${message.from}`);
        await api.send({
          to: message.from,
          message: "Não foi possível processar o áudio. Por favor, tente novamente.",
        });
        return;
      }

      try {
        const mediaUrl = await api.getMediaUrl(message.audioId);
        const audioBuffer = await api.downloadAudio(mediaUrl);
        const tempFilePath = await api.saveTempAudio(audioBuffer);

        const openai = new OpenAiApi();
        messageContent = await openai.transcribeAudio(tempFilePath);

        if (!messageContent.trim()) {
          await api.send({
            to: message.from,
            message: "Não consegui entender o áudio. Por favor, tente novamente ou envie uma mensagem de texto.",
          });
          return;
        }

        // rollback: remover esta linha
        messageContent = `__audio__: ${messageContent}`;
        console.log(`[WhatsApp] audio transcribed for ${message.from}: "${messageContent}"`);
      } catch (error) {
        console.error(`[WhatsApp] failed to process audio from ${message.from}:`, error);
        await api.send({
          to: message.from,
          message: "Ocorreu um erro ao processar o áudio. Por favor, tente novamente ou envie uma mensagem de texto.",
        });
        return;
      }
    }

    const responseText = await this.message(
      { content: messageContent, actChapterId: chapterId, userId: user.id },
      {
        externalId: message.externalId,
        instructionsComplement: [
          "Você está respondendo via WhatsApp. Use apenas formatação compatível com WhatsApp.",
          // rollback: remover esta linha
          "Quando a mensagem do usuário começar com __audio__: significa que o conteúdo foi transcrito de um áudio de voz. Considere isso ao interpretar a mensagem.",
          "Não use markdown complexo, tabelas, headings (#), HTML ou blocos incompatíveis.",
          "Formatações permitidas:",
          "*negrito* com um asterisco,",
          "_itálico_ com underscores,",
          "~tachado~ com tils,",
          "`código inline` com um backtick,",
          "```monospace``` com três backticks.",
          "Para listas, use '- item', '* item' ou '1. item'.",
          "Para citações, use '> texto'.",
          "Nunca use **negrito duplo**.",
        ].join("\n"),
      },
    );
    await api.send({ to: message.from, message: responseText });
  }
}

export { ActService };
