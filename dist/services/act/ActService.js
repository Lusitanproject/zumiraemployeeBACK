"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActService = exports.ANALYSIS_FILTER_COLUMNS = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const openai_1 = require("../../external/openai");
const UserService_1 = require("../user/UserService");
// ── Analysis types ────────────────────────────────────────────────────────────
exports.ANALYSIS_FILTER_COLUMNS = [
    "gender",
    "occupation",
    "occupationLevel",
    "area",
    "location",
    "skinColor",
    "hasDisability",
    "nationalityId",
];
function getProgress(bots, chapters) {
    const _bots = [...bots].sort((a, b) => a.index - b.index);
    let completedActs = 0;
    for (const bot of _bots) {
        if (chapters.find((chapter) => chapter.actChatbotId === bot.id && !!chapter.compilation)) {
            completedActs += 1;
        }
        else {
            break;
        }
    }
    return completedActs / _bots.length;
}
class ActService {
    async compileChapter({ actChapterId, userId }) {
        const chapter = await prisma_1.default.actChapter.findFirst({
            where: { userId, id: actChapterId },
            include: {
                messages: { orderBy: { createdAt: "asc" } },
                actChatbot: true,
            },
        });
        if (!chapter)
            throw new Error("Chapter not found");
        const messages = chapter.messages.map((m) => ({
            content: m.content,
            role: "user",
        }));
        const openai = new openai_1.OpenAiApi();
        const response = await openai.generateResponse({
            messages,
            instructions: chapter.actChatbot.compilationInstructions,
        });
        const data = await prisma_1.default.actChapter.update({
            where: { id: actChapterId },
            data: { compilation: response.output_text },
        });
        return data;
    }
    async createChapter(data) {
        await prisma_1.default.actChapter.deleteMany({
            where: { userId: data.userId, messages: { none: {} } },
        });
        const chapter = await prisma_1.default.actChapter.create({
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
    async getChapter({ userId, actChapterId }) {
        const [chapter, messages] = await Promise.all([
            prisma_1.default.actChapter.findFirst({
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
            prisma_1.default.actChapterMessage.findMany({
                where: { actChapterId, actChapter: { userId } },
                select: { content: true, role: true, createdAt: true, updatedAt: true },
                orderBy: { createdAt: "asc" },
            }),
        ]);
        if (!chapter)
            throw new Error("Chapter not found");
        return { ...chapter, messages };
    }
    async list(userId) {
        var _a, _b;
        const user = await prisma_1.default.user.findFirst({
            where: { id: userId },
            include: { company: true },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const [chatbots, chapters] = await Promise.all([
            prisma_1.default.actChatbot.findMany({
                where: { trailId: (_a = user.company) === null || _a === void 0 ? void 0 : _a.trailId },
                select: { id: true, name: true, description: true, icon: true, index: true },
                orderBy: { index: "asc" },
            }),
            prisma_1.default.actChapter.findMany({
                where: {
                    userId,
                    type: "REGULAR",
                    actChatbot: { trailId: (_b = user.company) === null || _b === void 0 ? void 0 : _b.trailId },
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
            if (!chatbots.length)
                return { chatbots: [], chapters: [] };
            currAct = chatbots[0];
            await prisma_1.default.user.update({ where: { id: userId }, data: { currentActChatbotId: currAct === null || currAct === void 0 ? void 0 : currAct.id } });
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
    async getFullStory(userId) {
        var _a;
        const user = await prisma_1.default.user.findFirst({ where: { id: userId }, select: { company: true } });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        const chapters = await prisma_1.default.actChapter.findMany({
            where: {
                userId,
                type: "REGULAR",
                compilation: { not: null },
                actChatbot: { trailId: (_a = user.company) === null || _a === void 0 ? void 0 : _a.trailId },
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
    async message({ content, actChapterId, userId }) {
        const conv = await prisma_1.default.actChapter.findFirst({
            where: { id: actChapterId, userId },
            include: { actChatbot: true, user: true },
        });
        if (!conv)
            throw new error_1.PublicError("Conversa não existe");
        await prisma_1.default.actChapterMessage.create({
            data: { actChapterId, role: "user", content },
        });
        const { actChatbot: bot } = conv;
        const messages = await prisma_1.default.actChapterMessage.findMany({
            where: { actChapterId },
            orderBy: { createdAt: "asc" },
        });
        const historyAndInput = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        if (conv.actChatbot.initialMessage)
            historyAndInput.unshift({ role: "assistant", content: conv.actChatbot.initialMessage });
        const openai = new openai_1.OpenAiApi();
        const response = await openai.generateResponse({
            instructions: bot.messageInstructions + `\nO nome do usuário é: ${conv.user.name.split(" ")[0]}`,
            messages: historyAndInput,
        });
        await Promise.all([
            prisma_1.default.actChapterMessage.create({
                data: { actChapterId, role: "assistant", content: response.output_text },
            }),
            prisma_1.default.actChapter.update({
                where: { id: actChapterId },
                data: { updatedAt: new Date() },
            }),
        ]);
        return response.output_text;
    }
    async moveToNext(userId) {
        var _a;
        const user = await prisma_1.default.user.findFirst({
            where: { id: userId },
            include: { currentActChatbot: true, company: true },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não encontrado");
        if (!user.currentActChatbot)
            throw new error_1.PublicError("Usuário não está atribuído a nenhum ato");
        const trailId = (_a = user.company) === null || _a === void 0 ? void 0 : _a.trailId;
        const currentActMessages = await prisma_1.default.actChapterMessage.findMany({
            where: { actChapter: { userId, actChatbotId: user.currentActChatbot.id } },
        });
        if (!currentActMessages.length)
            throw new error_1.PublicError("Usuário não iniciou o ato atual");
        const nextAct = await prisma_1.default.actChatbot.findFirst({
            where: { trailId, index: user.currentActChatbot.index + 1 },
        });
        if (!nextAct)
            return { currActChatbotId: user.currentActChatbot.id };
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { currentActChatbotId: nextAct.id },
        });
        return { currActChatbotId: nextAct.id };
    }
    async updateChapter({ userId, actChapterId, compilation, title }) {
        const chapter = await prisma_1.default.actChapter.findFirst({ where: { id: actChapterId, userId } });
        if (!chapter)
            throw new Error("Chapter not found");
        const result = await prisma_1.default.actChapter.update({
            where: { id: actChapterId, userId },
            data: { compilation, title },
        });
        return result;
    }
    // ── ActChatbot methods ────────────────────────────────────────────────────
    async findById(id) {
        const bot = await prisma_1.default.actChatbot.findFirst({
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
                actChapters: {
                    where: { type: "ADMIN_TEST" },
                    select: { id: true, title: true },
                },
            },
        });
        return bot;
    }
    async findByCompany(companyId) {
        const company = await prisma_1.default.company.findFirst({
            where: { id: companyId },
            select: { trailId: true },
        });
        if (!company)
            throw new error_1.PublicError("Company not found");
        const actListSelect = {
            id: true,
            name: true,
            description: true,
            icon: true,
            index: true,
            trailId: true,
            createdAt: true,
        };
        const bots = await prisma_1.default.actChatbot.findMany({
            select: actListSelect,
            where: { trailId: company.trailId },
            orderBy: { index: "asc" },
        });
        return { items: bots };
    }
    // ── Analysis private helpers ──────────────────────────────────────────────
    async retrieveAndSaveAnalysisResults(storedBatches) {
        const openai = new openai_1.OpenAiApi();
        const pendingBatches = storedBatches.filter((batch) => batch.status !== "completed");
        const batchResults = await Promise.all(pendingBatches.map((pending) => openai.retrieveBatchResult(pending.batchId)));
        batchResults.forEach(({ batchId, status }) => {
            console.log(`Lote OpenAI ${batchId} retornou status ${status}`);
        });
        const newCompletedBatchResults = batchResults.filter((batchRes) => batchRes.status === "completed");
        const allDone = newCompletedBatchResults.length === pendingBatches.length;
        const externalToLocalBatchId = pendingBatches.reduce((prev, curr) => {
            prev.set(curr.batchId, curr.id);
            return prev;
        }, new Map());
        const candidateAssociations = newCompletedBatchResults.flatMap(({ results, batchId }) => {
            var _a;
            return (_a = results === null || results === void 0 ? void 0 : results.flatMap(({ data }) => data
                ? data.associations.map((a) => ({
                    factorId: a.factor_id,
                    messageId: a.message_id,
                    analysisBatchId: externalToLocalBatchId.get(batchId),
                    author: client_1.MessageFactorAuthor.AI,
                }))
                : [])) !== null && _a !== void 0 ? _a : [];
        });
        const candidateMessageIds = [...new Set(candidateAssociations.map((a) => a.messageId))];
        const existingMessages = await prisma_1.default.actChapterMessage.findMany({
            where: { id: { in: candidateMessageIds } },
            select: { id: true },
        });
        const validMessageIds = new Set(existingMessages.map((m) => m.id));
        const invalidIds = candidateMessageIds.filter((id) => !validMessageIds.has(id));
        if (invalidIds.length > 0) {
            console.warn(`[ActService] ${invalidIds.length} message_id(s) retornados pela IA não existem no banco e serão ignorados:`, invalidIds);
        }
        await prisma_1.default.actMessagesPsychosocialFactors.createMany({
            data: candidateAssociations.filter((a) => validMessageIds.has(a.messageId)),
            skipDuplicates: true,
        });
        await Promise.all(batchResults.map(({ batchId, status }) => prisma_1.default.companyActAnalysisBatch.update({
            where: { id: externalToLocalBatchId.get(batchId) },
            data: { status },
        })));
        return allDone;
    }
    async resolveLatestAnalysis(companyId, actChatbotId) {
        const analysis = await prisma_1.default.companyActAnalysis.findFirst({
            orderBy: { createdAt: "desc" },
            where: { companyId, actChatbotId },
            include: { companyActAnalysisBatches: true },
        });
        if (!analysis)
            throw new error_1.PublicError("No act analysis for this company was found.");
        const alreadySaved = analysis.companyActAnalysisBatches.every((batch) => batch.status === "completed");
        if (!alreadySaved) {
            const allDone = await this.retrieveAndSaveAnalysisResults(analysis.companyActAnalysisBatches);
            if (!allDone)
                return null;
        }
        return analysis;
    }
    async queryAnalysisRows(analysisId, filters) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const gender = (_a = filters.gender) !== null && _a !== void 0 ? _a : null;
        const area = (_b = filters.area) !== null && _b !== void 0 ? _b : null;
        const location = (_c = filters.location) !== null && _c !== void 0 ? _c : null;
        const search = (_d = filters.search) !== null && _d !== void 0 ? _d : null;
        const occupation = (_e = filters.occupation) !== null && _e !== void 0 ? _e : null;
        const occupationLevel = (_f = filters.occupationLevel) !== null && _f !== void 0 ? _f : null;
        const skinColor = (_g = filters.skinColor) !== null && _g !== void 0 ? _g : null;
        const hasDisability = (_h = filters.hasDisability) !== null && _h !== void 0 ? _h : null;
        const nationalityId = (_j = filters.nationalityId) !== null && _j !== void 0 ? _j : null;
        const rows = (await prisma_1.default.$queryRaw `
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
    `);
        return rows.map((r) => ({
            factor: {
                id: r.factor_id_full,
                name: r.factor_name,
                wheight: r.factor_wheight,
                weightedScore: r.factor_wheight * r.total,
            },
            selfMonitoringBlock: { id: r.smb_id, name: r.smb_title },
            count: r.total,
        }));
    }
    async findAnalysisSegments(companyId, actChatbotId, column, ranges) {
        const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const declarations = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: {
                effective: true,
                message: { actChapter: { user: { companyId } } },
                analysisBatch: { companyActAnalysisId: analysis.id },
            },
            include: {
                message: { select: { actChapter: { select: { userId: true } } } },
                factor: { select: { wheight: true } },
            },
        });
        const includedUsers = await prisma_1.default.user.findMany({
            where: { id: { in: declarations.map((d) => d.message.actChapter.userId) } },
        });
        const userMap = new Map(includedUsers.map((u) => [u.id, u]));
        const resolveKey = (userId) => {
            var _a, _b;
            const user = userMap.get(userId);
            if (!user)
                return "null";
            if (column === "age") {
                if (!user.birthdate)
                    return "null";
                const age = Math.floor((Date.now() - new Date(user.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                if (!(ranges === null || ranges === void 0 ? void 0 : ranges.length))
                    return String(age);
                const bucket = ranges.find((r) => age >= r.min && age < r.max);
                return (_a = bucket === null || bucket === void 0 ? void 0 : bucket.label) !== null && _a !== void 0 ? _a : "null";
            }
            return String((_b = user[column]) !== null && _b !== void 0 ? _b : "null");
        };
        const byGroup = new Map();
        for (const d of declarations) {
            const key = resolveKey(d.message.actChapter.userId);
            if (!byGroup.has(key))
                byGroup.set(key, []);
            byGroup.get(key).push(d.factor.wheight);
        }
        const groups = [];
        for (const [key, wheights] of byGroup) {
            const positiveScore = wheights.filter((w) => w > 0).reduce((s, w) => s + w, 0);
            const negativeScore = wheights.filter((w) => w <= 0).reduce((s, w) => s + w, 0);
            const totalScore = positiveScore + negativeScore;
            const absoluteScore = positiveScore + Math.abs(negativeScore);
            const wellnessPercentage = absoluteScore > 0 ? (positiveScore / absoluteScore) * 100 : 0;
            groups.push({
                value: key === "null" ? null : key,
                positiveScore,
                negativeScore,
                totalScore,
                absoluteScore,
                wellnessPercentage,
            });
        }
        return { available: true, column, groups };
    }
    async findAnalysisFactorWeights(companyId, actChatbotId) {
        const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const declarations = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: {
                effective: true,
                message: { actChapter: { user: { companyId } } },
                analysisBatch: { companyActAnalysisId: analysis.id },
            },
            include: {
                factor: { select: { id: true, name: true, wheight: true } },
                message: { select: { actChapter: { select: { userId: true } } } },
            },
        });
        const factorMap = new Map();
        const userIds = new Set();
        for (const d of declarations) {
            userIds.add(d.message.actChapter.userId);
            const entry = factorMap.get(d.factorId);
            if (entry) {
                entry.count++;
            }
            else {
                factorMap.set(d.factorId, { factor: d.factor, count: 1 });
            }
        }
        const factors = Array.from(factorMap.values()).map(({ factor, count }) => ({
            id: factor.id,
            name: factor.name,
            wheight: factor.wheight,
            count,
            totalWeight: factor.wheight * count,
        }));
        return { available: true, factors, userCount: userIds.size };
    }
    // ── Analysis public methods ───────────────────────────────────────────────
    async findAnalysis(companyId, actChatbotId, filters = {}, pagination = { page: 1, pageSize: 10 }) {
        const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const allItems = await this.queryAnalysisRows(analysis.id, filters);
        const { page, pageSize } = pagination;
        const total = allItems.length;
        const offset = (page - 1) * pageSize;
        const items = allItems.slice(offset, offset + pageSize);
        return { available: true, items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    }
    async findAnalysisSummary(companyId, actChatbotId, filters = {}) {
        const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const items = await this.queryAnalysisRows(analysis.id, filters);
        const totalScore = items.reduce((sum, item) => sum + item.factor.weightedScore, 0);
        const positiveScore = items
            .filter((item) => item.factor.wheight > 0)
            .reduce((sum, item) => sum + item.factor.weightedScore, 0);
        const negativeScore = items
            .filter((item) => item.factor.wheight <= 0)
            .reduce((sum, item) => sum + item.factor.weightedScore, 0);
        const blockMap = new Map();
        for (const item of items) {
            const { id, name } = item.selfMonitoringBlock;
            if (!blockMap.has(id))
                blockMap.set(id, { id, name, topFactors: [] });
            blockMap.get(id).topFactors.push({
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
    async getAnalysisUserFilters(companyId, actChatbotId, columns) {
        const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);
        const factorAssocs = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: { effective: true, analysisBatchId: { in: batchIds } },
            select: { message: { select: { actChapter: { select: { userId: true } } } } },
        });
        const userIds = [...new Set(factorAssocs.map((a) => a.message.actChapter.userId))];
        const filters = await new UserService_1.UserService().getFilters(columns, userIds);
        return { available: true, filters };
    }
    async findAnalysisFactorMessages(companyId, actChatbotId, factorId) {
        const analysis = await this.resolveLatestAnalysis(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);
        const associations = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: { effective: true, factorId, analysisBatchId: { in: batchIds } },
            include: { message: true },
        });
        return { available: true, associations };
    }
    async overrideFactorAssociations(overrides) {
        const existingIds = overrides.map((o) => o.associationId);
        const toReplace = overrides.filter((o) => o.newFactorId !== null);
        await prisma_1.default.$transaction(async (tx) => {
            if (toReplace.length > 0) {
                const existing = await tx.actMessagesPsychosocialFactors.findMany({
                    where: { id: { in: toReplace.map((o) => o.associationId) } },
                });
                await tx.actMessagesPsychosocialFactors.createMany({
                    data: existing.map((e) => {
                        const override = toReplace.find((o) => o.associationId === e.id);
                        return {
                            messageId: e.messageId,
                            factorId: override.newFactorId,
                            analysisBatchId: e.analysisBatchId,
                            effective: true,
                            author: client_1.MessageFactorAuthor.HUMAN,
                        };
                    }),
                });
            }
            const toMarkNonApplicable = overrides.filter((o) => o.newFactorId === null).map((o) => o.associationId);
            await tx.actMessagesPsychosocialFactors.updateMany({
                where: { id: { in: existingIds } },
                data: { effective: false },
            });
            if (toMarkNonApplicable.length > 0) {
                await tx.actMessagesPsychosocialFactors.updateMany({
                    where: { id: { in: toMarkNonApplicable } },
                    data: { nonApplicable: true },
                });
            }
        });
    }
    async generateAnalysisReport(companyId, actChatbotId) {
        const [byArea, byGender, byDisability, byOccupationLevel, byAgeRange, weightsResult] = await Promise.all([
            this.findAnalysisSegments(companyId, actChatbotId, "area"),
            this.findAnalysisSegments(companyId, actChatbotId, "gender"),
            this.findAnalysisSegments(companyId, actChatbotId, "hasDisability"),
            this.findAnalysisSegments(companyId, actChatbotId, "occupationLevel"),
            this.findAnalysisSegments(companyId, actChatbotId, "age", [{ label: "60+", min: 60, max: Infinity }]),
            this.findAnalysisFactorWeights(companyId, actChatbotId),
        ]);
        if (!byArea.available)
            return { available: false };
        const factorWeights = weightsResult.available ? weightsResult.factors : [];
        const positiveScore = factorWeights.filter((f) => f.wheight > 0).reduce((s, f) => s + f.totalWeight, 0);
        const negativeScore = factorWeights.filter((f) => f.wheight <= 0).reduce((s, f) => s + f.totalWeight, 0);
        const totalScore = positiveScore + negativeScore;
        const absoluteScore = positiveScore + Math.abs(negativeScore);
        const overall = {
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
exports.ActService = ActService;
