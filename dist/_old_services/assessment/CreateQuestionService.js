"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestionService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateQuestionService {
    async execute({ description, assessmentId, index, psychologicalDimensionId, choices }) {
        const assessmentExists = await prisma_1.default.assessment.findFirst({
            where: {
                id: assessmentId,
            },
        });
        if (!assessmentExists)
            throw new error_1.PublicError("Avaliação não existe");
        const dimensionExists = await prisma_1.default.psychologicalDimension.findFirst({
            where: {
                id: psychologicalDimensionId,
            },
        });
        if (!dimensionExists)
            throw new error_1.PublicError("Dimensão psicológica não existe");
        const question = await prisma_1.default.assessmentQuestion.create({
            data: {
                description,
                index,
                assessmentId,
                psychologicalDimensionId,
            },
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
}
exports.CreateQuestionService = CreateQuestionService;
