"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateResultScores = calculateResultScores;
const prisma_1 = __importDefault(require("../prisma"));
async function calculateResultScores(resultIds) {
    const results = await prisma_1.default.assessmentResult.findMany({
        where: {
            id: {
                in: resultIds,
            },
        },
        select: {
            id: true,
            assessment: {
                select: {
                    operationType: true,
                    assessmentQuestions: {
                        select: {
                            psychologicalDimensionId: true,
                            psychologicalDimension: {
                                select: {
                                    id: true,
                                    acronym: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
            assessmentQuestionAnswers: {
                select: {
                    assessmentQuestion: {
                        select: {
                            psychologicalDimensionId: true,
                        },
                    },
                    assessmentQuestionChoice: {
                        select: {
                            value: true,
                        },
                    },
                },
            },
        },
    });
    if (!results.length)
        return [];
    const sample = results[0];
    const dimensionIds = [...new Set(sample.assessment.assessmentQuestions.map((q) => q.psychologicalDimensionId))];
    const dimensions = dimensionIds
        .map((id) => { var _a; return (_a = sample.assessment.assessmentQuestions.find((q) => q.psychologicalDimensionId === id)) === null || _a === void 0 ? void 0 : _a.psychologicalDimension; })
        .filter((o) => !!o);
    const operation = sample.assessment.operationType;
    const allScores = [];
    for (const result of results) {
        const answersByDimension = dimensionIds.map((id) => ({
            dimension: dimensions.find((d) => d.id === id),
            answers: result.assessmentQuestionAnswers.filter((a) => a.assessmentQuestion.psychologicalDimensionId === id),
        }));
        const dimensionScores = [];
        for (const { dimension, answers } of answersByDimension) {
            const sum = answers.reduce((prev, curr) => prev + curr.assessmentQuestionChoice.value, 0);
            const value = operation === "SUM" ? sum : sum / answers.length;
            dimensionScores.push({ dimension, value });
        }
        allScores.push({ assessmentResultId: result.id, scores: dimensionScores });
    }
    return allScores;
}
