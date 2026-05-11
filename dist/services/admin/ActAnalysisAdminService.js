"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANALYSIS_FILTER_COLUMNS = exports.ActAnalysisAdminService = void 0;
const error_1 = require("../../error");
const openai_1 = require("../../external/openai");
const prisma_1 = __importDefault(require("../../prisma"));
const UserAdminService_1 = require("./UserAdminService");
const ANALYSIS_FILTER_COLUMNS = [
    "gender",
    "occupation",
    "occupationLevel",
    "area",
    "location",
    "skinColor",
    "hasDisability",
    "nationalityId",
];
exports.ANALYSIS_FILTER_COLUMNS = ANALYSIS_FILTER_COLUMNS;
class ActAnalysisAdminService {
    async buildPsychosocialPrompt(factors) {
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
    async retrieveAndSaveResults(storedBatches) {
        const openai = new openai_1.OpenAiApi();
        const pendingBatches = storedBatches.filter((batch) => batch.status !== "completed");
        const batchResults = await Promise.all(pendingBatches.map((pending) => openai.retrieveBatchResult(pending.batchId)));
        batchResults.forEach(({ batchId, status }) => {
            console.log(`Lote OpenAI ${batchId} retornou status ${status}`);
        });
        batchResults.forEach(({ batchId, results }) => {
            results === null || results === void 0 ? void 0 : results.forEach(({ customId, data }) => {
                console.log(`Lote OpenAI ${batchId} resultado ${customId !== null && customId !== void 0 ? customId : "sem customId"}: ${JSON.stringify(data, null, 2)}`);
            });
        });
        const newCompletedBatchResults = batchResults.filter((batchRes) => batchRes.status === "completed");
        const allDone = newCompletedBatchResults.length === pendingBatches.length;
        console.log(`Lotes processados: total ${storedBatches.length}, concluídos ${newCompletedBatchResults.length}, pendentes ${pendingBatches.length - newCompletedBatchResults.length}`);
        const externalToLocalBatchId = pendingBatches.reduce((prev, curr) => {
            prev.set(curr.batchId, curr.id);
            return prev;
        }, new Map());
        await prisma_1.default.actMessagesPsychosocialFactors.createMany({
            data: newCompletedBatchResults.flatMap(({ results, batchId }) => {
                var _a;
                return (_a = results === null || results === void 0 ? void 0 : results.flatMap(({ data }) => data
                    ? data.associations.map((a) => ({
                        factorId: a.factor_id,
                        messageId: a.message_id,
                        analysisBatchId: externalToLocalBatchId.get(batchId),
                    }))
                    : [])) !== null && _a !== void 0 ? _a : [];
            }),
            skipDuplicates: true,
        });
        await Promise.all(batchResults.map(({ batchId, status }) => prisma_1.default.companyActAnalysisBatch.update({
            where: {
                id: externalToLocalBatchId.get(batchId),
            },
            data: {
                status,
            },
        })));
        return allDone;
    }
    async resolveLatest(companyId, actChatbotId) {
        const analysis = await prisma_1.default.companyActAnalysis.findFirst({
            orderBy: { createdAt: "desc" },
            where: { companyId, actChatbotId },
            include: { companyActAnalysisBatches: true },
        });
        if (!analysis) {
            throw new error_1.PublicError("No act analysis for this company was found.");
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
    async generate(companyId, actChatbotId) {
        console.log(`Gerando análise para a empresa ${companyId} e o chatbot ${actChatbotId}`);
        const factors = await prisma_1.default.psychosocialFactor.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        const chapters = await prisma_1.default.actChapter.findMany({
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
        const newAnalysis = await prisma_1.default.companyActAnalysis.create({
            data: {
                actChatbotId,
                companyId,
            },
        });
        const instructions = await this.buildPsychosocialPrompt(factors);
        const batchItems = chapters.map((chapter) => ({
            customId: chapter.id,
            messages: [{ content: JSON.stringify(chapter.messages), role: "user" }],
        }));
        const openai = new openai_1.OpenAiApi();
        const batchResult = await openai.createBatch({ instructions, batchItems });
        console.log(`Lote OpenAI criado com ${batchItems.length} itens`);
        await prisma_1.default.companyActAnalysisBatch.create({
            data: {
                batchId: batchResult.batchId,
                companyActAnalysisId: newAnalysis.id,
            },
        });
    }
    async queryRows(analysisId, filters) {
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
    async find(companyId, actChatbotId, filters = {}, pagination = { page: 1, pageSize: 10 }) {
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
    async findSummary(companyId, actChatbotId, filters = {}) {
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
        const blockMap = new Map();
        for (const item of items) {
            const { id, name } = item.selfMonitoringBlock;
            if (!blockMap.has(id)) {
                blockMap.set(id, { id, name, topFactors: [] });
            }
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
    async getUserFilters(companyId, actChatbotId, columns) {
        const analysis = await this.resolveLatest(companyId, actChatbotId);
        if (!analysis) {
            return { available: false };
        }
        const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);
        const factorAssocs = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: { analysisBatchId: { in: batchIds } },
            select: { message: { select: { actChapter: { select: { userId: true } } } } },
        });
        const userIds = [...new Set(factorAssocs.map((a) => a.message.actChapter.userId))];
        const filters = await new UserAdminService_1.UserAdminService().getFilters(columns, userIds);
        return { available: true, filters };
    }
    async findFactorMessages(companyId, actChatbotId, factorId) {
        const analysis = await this.resolveLatest(companyId, actChatbotId);
        if (!analysis) {
            return { available: false };
        }
        const batchIds = analysis.companyActAnalysisBatches.map((b) => b.id);
        const associations = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: {
                factorId,
                analysisBatchId: { in: batchIds },
            },
            include: {
                message: true,
            },
        });
        const messages = associations.map((a) => a.message);
        return { available: true, messages };
    }
    async findSegments(companyId, actChatbotId, column, ranges) {
        const analysis = await this.resolveLatest(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const declarations = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: {
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
                // Intervalo fechado em min, aberto em max: [min, max). Ex: {min:18, max:30} captura 18–29.
                const bucket = ranges.find((r) => age >= r.min && age < r.max);
                return (_a = bucket === null || bucket === void 0 ? void 0 : bucket.label) !== null && _a !== void 0 ? _a : "null";
            }
            // Para colunas string/enum/boolean, usa o valor bruto como chave. Ausente → "null".
            return String((_b = user[column]) !== null && _b !== void 0 ? _b : "null");
        };
        // Cada declaração vira um wheight na lista do grupo correspondente ao valor da coluna do usuário.
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
            groups.push({ value: key === "null" ? null : key, positiveScore, negativeScore, totalScore, absoluteScore, wellnessPercentage });
        }
        return { available: true, column, groups };
    }
    async findFactorWeights(companyId, actChatbotId) {
        const analysis = await this.resolveLatest(companyId, actChatbotId);
        if (!analysis)
            return { available: false };
        const declarations = await prisma_1.default.actMessagesPsychosocialFactors.findMany({
            where: {
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
    async generateReport(companyId, actChatbotId) {
        const [byArea, byGender, byDisability, byOccupationLevel, byAgeRange, weightsResult] = await Promise.all([
            this.findSegments(companyId, actChatbotId, "area"),
            this.findSegments(companyId, actChatbotId, "gender"),
            this.findSegments(companyId, actChatbotId, "hasDisability"),
            this.findSegments(companyId, actChatbotId, "occupationLevel"),
            this.findSegments(companyId, actChatbotId, "age", [{ label: "60+", min: 60, max: Infinity }]),
            this.findFactorWeights(companyId, actChatbotId),
        ]);
        if (!byArea.available)
            return { available: false };
        const factorWeights = weightsResult.available ? weightsResult.factors : [];
        // Overall derivado dos factor weights — sem DB call extra
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
exports.ActAnalysisAdminService = ActAnalysisAdminService;
