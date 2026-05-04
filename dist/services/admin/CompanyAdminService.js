"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAdminService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const openai_1 = require("../../external/openai");
class CompanyAdminService {
    async find(companyId) {
        const company = await prisma_1.default.company.findFirst({
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
        const companies = await prisma_1.default.company.findMany();
        return companies;
    }
    async findAllFeedbacks(userId) {
        const user = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
                companyId: {
                    not: null,
                },
            },
        });
        if (!(user === null || user === void 0 ? void 0 : user.companyId))
            throw new error_1.PublicError("Usuário não está associado a uma empresa");
        const allFeedbacks = await prisma_1.default.companyAssessmentFeedback.findMany({
            where: {
                companyId: user.companyId,
            },
            include: {
                assessment: true,
            },
        });
        const aux = {};
        allFeedbacks.forEach((f) => {
            const id = f.assessmentId;
            if (!aux[id] || f.createdAt > aux[id].createdAt)
                aux[id] = f;
        });
        return { items: Object.values(aux) };
    }
    async create(data) {
        const company = await prisma_1.default.company.create({ data });
        return company;
    }
    async update({ id, ...data }) {
        const company = await prisma_1.default.company.update({ where: { id }, data });
        return company;
    }
    async setCompanyAssessments({ id: companyId, assessmentIds }) {
        const [company, newAssessments, currentAssessments] = await Promise.all([
            prisma_1.default.company.findFirst({
                where: {
                    id: companyId,
                },
            }),
            prisma_1.default.assessment.findMany({
                where: {
                    id: {
                        in: assessmentIds,
                    },
                },
            }),
            prisma_1.default.companyAvailableAssessment.findMany({ where: { companyId } }),
        ]);
        if (!company)
            throw new Error("Empresa não existe");
        if (assessmentIds.find((id) => !newAssessments.find((assessment) => id === assessment.id))) {
            throw new Error("Um ou mais testes enviados não existem");
        }
        const deletedAssessmentIds = currentAssessments
            .filter((curr) => !assessmentIds.includes(curr.assessmentId))
            .map((item) => item.assessmentId);
        await Promise.all([
            prisma_1.default.companyAvailableAssessment.createMany({
                data: assessmentIds.map((assessmentId) => ({
                    assessmentId,
                    companyId,
                })),
                skipDuplicates: true,
            }),
            prisma_1.default.companyAvailableAssessment.deleteMany({
                where: {
                    assessmentId: {
                        in: deletedAssessmentIds,
                    },
                },
            }),
        ]);
    }
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
    async generateActAnalysis(id, actChatbotId) {
        console.log(`Gerando análise para a empresa ${id} e o chatbot ${actChatbotId}`);
        const factors = await prisma_1.default.psychosocialFactor.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        const chapters = await prisma_1.default.actChapter.findMany({
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
        const newAnalysis = await prisma_1.default.companyActAnalysis.create({
            data: {
                actChatbotId,
                companyId: id,
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
    async findActAnalysis(id, actChatbotId) {
        console.log(`Buscando análise da empresa ${id} para o chatbot ${actChatbotId}`);
        const analysis = await prisma_1.default.companyActAnalysis.findFirst({
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
            throw new error_1.PublicError("No act analysis for this company was found.");
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
        // Filtros
        //   WHERE
        // u.company_id = ${companyId}
        // AND (${gender}::text IS NULL OR u.gender = ${gender})
        // AND (${area}::text IS NULL OR u.area = ${area})
        const result = (await prisma_1.default.$queryRaw `
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


      ),

      aggregated AS (
        SELECT
          act_analysis_id,
          factor_id,
          COUNT(*)::int AS total
        FROM filtered
        GROUP BY act_analysis_id, factor_id
      ),

      counted AS (
        SELECT COUNT(*)::int AS full_count FROM aggregated
      )

      SELECT
        a.act_analysis_id,
        a.factor_id,
        a.total,
        c.full_count,
        f.id as factor_id_full,
        f.name as factor_name,
        f.wheight as factor_wheight,
        smb.id as smb_id,
        smb.title as smb_title
      FROM aggregated a
      CROSS JOIN counted c
      JOIN psychosocial_factors f ON f.id = a.factor_id
      LEFT JOIN self_monitoring_blocks smb ON f.self_monitoring_block_id = smb.id
      ORDER BY a.total DESC
    `);
        // Paginacao
        // LIMIT ${limit}
        // OFFSET ${offset};
        const items = result.map((r) => ({
            factor: {
                id: r.factor_id_full,
                name: r.factor_name,
                wheight: r.factor_wheight,
                weightedScore: r.factor_wheight * r.total,
            },
            selfMonitoringBlock: { id: r.smb_id, name: r.smb_title },
            count: r.total,
        }));
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
        const selfMonitoringBlocks = Array.from(blockMap.values());
        console.log(`Análise pronta com ${items.length} registros`);
        return {
            available: true,
            items,
            totalScore,
            positiveScore,
            negativeScore,
            absoluteScore: positiveScore + Math.abs(negativeScore),
            selfMonitoringBlocks,
        };
    }
    async generateAllUserFeedback(companyId, sync = true) {
        const company = await prisma_1.default.company.findFirst({
            where: { id: companyId },
            include: {
                users: {
                    select: { id: true },
                },
            },
        });
        if (!company)
            throw new error_1.PublicError("Empresa não encontrada");
        const userIds = company.users.map((u) => u.id);
        if (userIds.length === 0) {
            return {
                companyId,
                queuedCount: 0,
                message: "Empresa sem usuários",
            };
        }
        // Get all assessment results for users in this company
        const allResults = await prisma_1.default.assessmentResult.findMany({
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
        const latestByPair = new Map();
        for (const result of allResults) {
            const key = `${result.userId}#${result.assessmentId}`;
            if (!latestByPair.has(key)) {
                latestByPair.set(key, result);
            }
        }
        const uniquePairs = Array.from(latestByPair.values());
        console.log(`Iniciando geração de feedback para empresa ${companyId}: ${uniquePairs.length} pares usuário+avaliação`);
        // Import GenerateUserFeedbackService dynamically to avoid circular dependency
        const { GenerateUserFeedbackService } = await Promise.resolve().then(() => __importStar(require("../assessment/GenerateUserFeedbackService")));
        const tasks = uniquePairs.map(async (pair) => {
            const generateService = new GenerateUserFeedbackService();
            return generateService.execute({ userId: pair.userId, assessmentId: pair.assessmentId }).catch((error) => {
                console.error(`Erro ao gerar feedback para usuário ${pair.userId} em avaliação ${pair.assessmentId}: `, error instanceof Error ? error.message : String(error));
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
exports.CompanyAdminService = CompanyAdminService;
