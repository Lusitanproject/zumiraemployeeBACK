"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultAdminService = void 0;
const exceljs_1 = require("exceljs");
const prisma_1 = __importDefault(require("../../prisma"));
const calculateResultScores_1 = require("../../utils/calculateResultScores");
class AssessmentResultAdminService {
    async findFiltered({ assessmentId, companyId }) {
        const results = await prisma_1.default.assessmentResult.findMany({
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
        const aux = {};
        for (const result of results) {
            if (!aux[result.user.id] || new Date(aux[result.user.id].createdAt) < new Date(result.createdAt)) {
                aux[result.user.id] = result;
            }
        }
        const lastResults = Object.values(aux);
        const scores = await (0, calculateResultScores_1.calculateResultScores)(lastResults.map((r) => r.id));
        const processedData = lastResults.map((r) => {
            var _a;
            return ({
                ...r,
                scores: (_a = scores.find((s) => s.assessmentResultId === r.id)) === null || _a === void 0 ? void 0 : _a.scores,
            });
        });
        return { items: processedData };
    }
    async generateExcelReport({ assessmentId, companyId }) {
        const assessment = await prisma_1.default.assessment.findFirst({
            where: {
                id: assessmentId,
            },
            include: {
                assessmentQuestions: true,
            },
        });
        if (!assessment)
            throw new Error("Assessment not found");
        const results = await prisma_1.default.assessmentResult.findMany({
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
        const aux = {};
        for (const result of results) {
            if (!aux[result.user.id] || new Date(aux[result.user.id].createdAt) < new Date(result.createdAt)) {
                aux[result.user.id] = result;
            }
        }
        const lastResults = Object.values(aux);
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet(`Relatório ${assessment.title}`);
        worksheet.columns = [
            { header: "Carimbo de data", key: "date", width: 15 },
            { header: "Código", key: "code", width: 6 },
            ...assessment.assessmentQuestions
                .sort((a, b) => a.index - b.index)
                .flatMap((question) => [
                { header: `${question.description}`, key: `question_${question.index}`, width: 50 },
                { header: `${question.index + 1}`, key: `index_${question.index}`, width: 3 },
            ]),
        ];
        const rows = {};
        for (let i = 0; i < lastResults.length; i++) {
            const result = lastResults[i];
            const row = { date: result.createdAt, code: `C-${(i + 1).toString().padStart(3, "0")}` };
            result.assessmentQuestionAnswers
                .sort((a, b) => a.assessmentQuestion.index - b.assessmentQuestion.index)
                .forEach((answer) => {
                row[`question_${answer.assessmentQuestion.index}`] = answer.assessmentQuestionChoice.label;
                row[`index_${answer.assessmentQuestion.index}`] = answer.assessmentQuestionChoice.value;
            });
            if (!rows[result.user.id] || rows[result.user.id].date < result.createdAt)
                worksheet.addRow(row);
        }
        return workbook;
    }
}
exports.AssessmentResultAdminService = AssessmentResultAdminService;
