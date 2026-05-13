"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentService = void 0;
const client_1 = require("@prisma/client");
const openai_1 = __importDefault(require("openai"));
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
const devLog_1 = require("../../utils/devLog");
const calculateResultScores_1 = require("../../utils/calculateResultScores");
const UserService_1 = require("../user/UserService");
async function allQuestionsExist(ids) {
    const questions = await prisma_1.default.assessmentQuestion.findMany({
        where: { id: { in: ids } },
        select: { id: true },
    });
    for (const id of ids) {
        if (!questions.some((q) => q.id === id))
            return false;
    }
    return true;
}
async function allChoicesExist(ids) {
    const choices = await prisma_1.default.assessmentQuestionChoice.findMany({
        where: { id: { in: ids } },
        select: { id: true },
    });
    for (const id of ids) {
        if (!choices.some((c) => c.id === id))
            return false;
    }
    return true;
}
const assessmentResultInclude = client_1.Prisma.validator()({
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
function createFeedbackMessage(result) {
    const dimensionAnswersValues = {};
    result.assessmentQuestionAnswers.map((answer) => {
        const dimension = answer.assessmentQuestion.psychologicalDimension.name;
        if (!dimensionAnswersValues[dimension])
            dimensionAnswersValues[dimension] = [];
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
async function sendOpenAIMessage(instructions, message) {
    const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    const instructionsObj = {
        role: "system",
        content: [{ type: "input_text", text: instructions }],
    };
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
async function generateUserFeedbackResponse(instructions, message, ratings) {
    const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    const instructionsObj = {
        role: "system",
        content: [{ type: "input_text", text: instructions }],
    };
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
                description: "Devolutiva do teste psicológico, interpretando os resultados de seus domínios avaliados e identificando perfis associados.",
                parameters: {
                    type: "object",
                    required: ["feedback", "identifiedProfile", "generateAlert"],
                    properties: {
                        feedback: {
                            type: "string",
                            description: "Texto longo, completo e detalhado da devolutiva de acordo com a interpretação dos resultados. Utilize markdown.",
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
    async create(data) {
        const block = await prisma_1.default.selfMonitoringBlock.findFirst({
            where: { id: data.selfMonitoringBlockId },
        });
        if (!block)
            throw new error_1.PublicError("Bloco de auto monitoramento não existe");
        const assessment = await prisma_1.default.assessment.create({
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
    async createQuestion({ description, assessmentId, index, psychologicalDimensionId, choices }) {
        const assessmentExists = await prisma_1.default.assessment.findFirst({ where: { id: assessmentId } });
        if (!assessmentExists)
            throw new error_1.PublicError("Avaliação não existe");
        const dimensionExists = await prisma_1.default.psychologicalDimension.findFirst({
            where: { id: psychologicalDimensionId },
        });
        if (!dimensionExists)
            throw new error_1.PublicError("Dimensão psicológica não existe");
        const question = await prisma_1.default.assessmentQuestion.create({
            data: { description, index, assessmentId, psychologicalDimensionId },
            select: {
                id: true,
                description: true,
                assessmentId: true,
                psychologicalDimensionId: true,
            },
        });
        await prisma_1.default.assessmentQuestionChoice.createMany({
            data: choices.map((c) => ({
                label: c.label,
                value: c.value,
                index: c.index,
                assessmentQuestionId: question.id,
            })),
        });
        return question;
    }
    async createResult({ userId, assessmentId, answers }) {
        const userExists = await prisma_1.default.user.findFirst({ where: { id: userId } });
        if (!userExists)
            throw new error_1.PublicError("Usuário não existe");
        const assessmentExists = await prisma_1.default.assessment.findFirst({ where: { id: assessmentId } });
        if (!assessmentExists)
            throw new error_1.PublicError("Avaliação não existe");
        if (!allQuestionsExist(answers.map((a) => a.assessmentQuestionId))) {
            throw new error_1.PublicError("Uma ou mais perguntas não existem");
        }
        if (!allChoicesExist(answers.map((a) => a.assessmentQuestionChoiceId))) {
            throw new error_1.PublicError("Uma ou mais opções não existem");
        }
        const result = await prisma_1.default.assessmentResult.create({
            data: { userId, assessmentId },
            select: { id: true, userId: true, assessmentId: true },
        });
        await prisma_1.default.assessmentQuestionAnswer.createMany({
            data: answers.map((a) => ({
                userId,
                assessmentQuestionId: a.assessmentQuestionId,
                assessmentQuestionChoiceId: a.assessmentQuestionChoiceId,
                assessmentResultId: result.id,
            })),
        });
        return result;
    }
    async detail({ userId, assessmentId }) {
        const assessment = await prisma_1.default.assessment.findFirst({
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
        if (!assessment)
            throw new error_1.PublicError("Avaliação não existe");
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
    async detailResult({ userId, assessmentId }) {
        const result = await prisma_1.default.assessmentResult.findFirst({
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
        if (!result)
            throw new error_1.PublicError("Nenhum resultado para esta avaliação");
        const dimensions = {};
        result.assessmentQuestionAnswers.forEach((q) => {
            const dimension = q.assessmentQuestion.psychologicalDimension;
            const id = dimension.acronym + dimension.name;
            dimensions[id] = dimension;
        });
        return { ...result, psychologicalDimensions: Object.values(dimensions) };
    }
    async generateCompanyFeedback({ userId, assessmentId }) {
        const company = await prisma_1.default.company.findFirst({
            where: { users: { some: { id: userId } } },
            include: { users: true },
        });
        if (!company)
            throw new error_1.PublicError("Usuário não encontrado ou sem empresa associada.");
        const allResults = await prisma_1.default.assessmentResult.findMany({
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
        if (!allResults.length)
            throw new error_1.PublicError("Esta empresa não possui resultados para esta avaliação");
        const exampleResult = allResults[0];
        const assessment = exampleResult.assessment;
        const latestResults = {};
        allResults.forEach((r) => {
            if (!latestResults[r.userId] || latestResults[r.userId].createdAt < r.createdAt)
                latestResults[r.userId] = r;
        });
        const dimensionScores = {};
        for (const result of Object.values(latestResults)) {
            const userDimensionAnswersValues = {};
            for (const answer of result.assessmentQuestionAnswers) {
                const dimension = answer.assessmentQuestion.psychologicalDimension.name;
                if (!userDimensionAnswersValues[dimension])
                    userDimensionAnswersValues[dimension] = [];
                userDimensionAnswersValues[dimension].push(answer.assessmentQuestionChoice.value);
            }
            for (const [dimension, scores] of Object.entries(userDimensionAnswersValues)) {
                const sum = scores.reduce((sum, v) => sum + v, 0);
                const average = sum / scores.length;
                if (!dimensionScores[dimension])
                    dimensionScores[dimension] = [];
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
        if (!message)
            throw new error_1.PublicError("Nenhum valor para enviar");
        const response = await sendOpenAIMessage(assessment.companyFeedbackInstructions, message);
        const assessmentFeedback = await prisma_1.default.companyAssessmentFeedback.create({
            data: {
                text: response.output_text,
                companyId: company.id,
                assessmentId,
                respondents: Object.keys(latestResults).length,
            },
            select: { id: true, text: true, companyId: true, assessmentId: true },
        });
        return assessmentFeedback;
    }
    async generateUserFeedback({ userId, assessmentId }) {
        const result = await prisma_1.default.assessmentResult.findFirst({
            where: { assessmentId, userId },
            include: assessmentResultInclude.include,
            orderBy: { createdAt: "desc" },
        });
        if (!result)
            throw new error_1.PublicError("Nenhum resultado para esta avaliação");
        const message = createFeedbackMessage(result);
        if (!message)
            throw new error_1.PublicError("Nenhum valor para enviar");
        (0, devLog_1.devLog)("Message: ", message);
        const response = await generateUserFeedbackResponse(result.assessment.userFeedbackInstructions, message, result.assessment.assessmentResultRatings);
        const toolCall = response.output[0];
        const args = JSON.parse(toolCall.arguments);
        (0, devLog_1.devLog)("AI response: ", args);
        const ratings = result.assessment.assessmentResultRatings;
        const rating = ratings.find((r) => r.profile === args.identifiedProfile);
        if (!rating && ratings.length !== 0) {
            throw new error_1.PublicError(`Perfil "${args.identifiedProfile}" não existe`);
        }
        await prisma_1.default.assessmentResult.update({
            where: { id: result.id },
            data: { feedback: args.feedback, assessmentResultRatingId: rating === null || rating === void 0 ? void 0 : rating.id },
        });
        if (args.generateAlert && rating) {
            await prisma_1.default.alert.create({
                data: { assessmentResultId: result.id, assessmentResultRatingId: rating.id },
            });
        }
        return args;
    }
    async list({ userId, nationalityId }) {
        const user = await prisma_1.default.user.findFirst({ where: { id: userId } });
        if (!user)
            throw new error_1.PublicError("Usuário não existe");
        const assessments = await prisma_1.default.assessment.findMany({
            where: {
                nationalityId,
                public: true,
                companyAvailableAssessments: user.companyId
                    ? { some: { companyId: user.companyId } }
                    : undefined,
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
    async listByCompany(userId) {
        const user = await prisma_1.default.user.findFirst({
            where: { id: userId },
            select: { companyId: true },
        });
        if (!user)
            throw new error_1.PublicError("Usuário não existe");
        if (!user.companyId)
            throw new error_1.PublicError("Usuário não está associado a uma empresa");
        const assessments = await prisma_1.default.assessment.findMany({
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
            };
        });
        return { assessments: formattedAssessments };
    }
    async listResults(userId) {
        const results = await prisma_1.default.assessmentResult.findMany({
            where: { userId },
            include: {
                assessment: { select: { id: true, title: true, summary: true } },
            },
        });
        const latestResults = {};
        results.forEach((r) => {
            if (!latestResults[r.assessment.id] || latestResults[r.assessment.id].createdAt < r.createdAt) {
                latestResults[r.assessment.id] = r;
            }
        });
        return { items: Object.values(latestResults) };
    }
    async updateQuestions({ assessmentId, questions }) {
        const startTime = new Date();
        const oldQuestions = await prisma_1.default.assessmentQuestion.findMany({
            where: { assessmentId },
            include: { assessmentQuestionChoices: true },
        });
        const oldChoices = oldQuestions.map((q) => q.assessmentQuestionChoices.map((c) => c)).flat();
        const deletedQuestions = oldQuestions.filter((oldQuestion) => !questions.some((q) => oldQuestion.id === q.id));
        const deletedChoices = oldChoices.filter((oldChoice) => !questions.some((q) => q.choices.some((c) => oldChoice.id === c.id)));
        for (const question of questions) {
            if (!question.id) {
                const createdQuestion = await prisma_1.default.assessmentQuestion.create({
                    data: {
                        assessmentId,
                        description: question.description,
                        index: question.index,
                        psychologicalDimensionId: question.psychologicalDimensionId,
                    },
                    select: { id: true, description: true, index: true, assessmentId: true, psychologicalDimensionId: true },
                });
                await prisma_1.default.assessmentQuestionChoice.createManyAndReturn({
                    data: question.choices.map((c) => ({
                        label: c.label,
                        value: c.value,
                        index: c.index,
                        assessmentQuestionId: createdQuestion.id,
                    })),
                });
            }
            else {
                const storedQuestion = oldQuestions.find((q) => q.id === question.id);
                const updated = (storedQuestion === null || storedQuestion === void 0 ? void 0 : storedQuestion.description) !== question.description ||
                    storedQuestion.index !== question.index ||
                    storedQuestion.psychologicalDimensionId !== question.psychologicalDimensionId;
                if (updated) {
                    await prisma_1.default.assessmentQuestion.update({
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
                        await prisma_1.default.assessmentQuestionChoice.create({
                            data: {
                                index: choice.index,
                                label: choice.label,
                                value: choice.value,
                                assessmentQuestionId: question.id,
                            },
                            select: { id: true, label: true, value: true, index: true, assessmentQuestionId: true },
                        });
                    }
                    else {
                        const storedChoice = oldChoices.find((c) => c.id === choice.id);
                        const updated = (storedChoice === null || storedChoice === void 0 ? void 0 : storedChoice.index) !== choice.index ||
                            storedChoice.label !== choice.label ||
                            storedChoice.value !== choice.value;
                        if (updated) {
                            await prisma_1.default.assessmentQuestionChoice.update({
                                where: { id: choice.id },
                                data: { index: choice.index, label: choice.label, value: choice.value },
                            });
                        }
                    }
                }
            }
        }
        await prisma_1.default.assessmentQuestion.deleteMany({
            where: { id: { in: deletedQuestions.map((q) => q.id).filter((id) => id !== undefined) } },
        });
        await prisma_1.default.assessmentQuestionChoice.deleteMany({
            where: { id: { in: deletedChoices.map((c) => c.id).filter((id) => id !== undefined) } },
        });
        const endTime = new Date();
        const timeDiffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
        console.log(`Updated assessment ${assessmentId} questions in ${timeDiffInSeconds} seconds`);
    }
    async processResults(results) {
        const aux = {};
        for (const result of results) {
            if (!aux[result.user.id] || new Date(aux[result.user.id].createdAt) < new Date(result.createdAt)) {
                aux[result.user.id] = result;
            }
        }
        const lastResults = Object.values(aux);
        const scores = await (0, calculateResultScores_1.calculateResultScores)(lastResults.map((r) => r.id));
        return lastResults.map((r) => {
            var _a;
            return ({
                ...r,
                scores: (_a = scores.find((s) => s.assessmentResultId === r.id)) === null || _a === void 0 ? void 0 : _a.scores,
            });
        });
    }
    async searchResults(assessmentId, { companyId, search, page, pageSize, gender, area, location, occupation, occupationLevel, skinColor, hasDisability, nationalityId }) {
        const RESULT_SELECT = {
            id: true,
            user: { select: { id: true, name: true, email: true, companyId: true, customId: true } },
            assessmentResultRating: { select: { risk: true, profile: true, color: true } },
            createdAt: true,
        };
        const results = await prisma_1.default.assessmentResult.findMany({
            where: {
                assessmentId,
                feedback: { not: null },
                assessmentResultRatingId: { not: null },
                ...(search && { assessmentResultRating: { profile: { contains: search, mode: "insensitive" } } }),
                user: {
                    ...(companyId && { companyId }),
                    ...(gender && { gender }),
                    ...(area && { area }),
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
        return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    }
    async getResultUserFilters(assessmentId, companyId, columns) {
        const rows = await prisma_1.default.assessmentResult.findMany({
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
        const filters = await new UserService_1.UserService().getFilters(columns, userIds);
        return { filters };
    }
}
exports.AssessmentService = AssessmentService;
