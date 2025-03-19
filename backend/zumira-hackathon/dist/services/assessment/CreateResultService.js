"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResultService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
async function allQuestionsExist(ids) {
    const questions = await prisma_1.default.assessmentQuestion.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
        },
    });
    for (const id of ids) {
        if (!questions.some((q) => q.id === id))
            return false;
    }
    return true;
}
async function allChoicesExist(ids) {
    const choices = await prisma_1.default.assessmentQuestionChoice.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: {
            id: true,
        },
    });
    for (const id of ids) {
        if (!choices.some((c) => c.id === id))
            return false;
    }
    return true;
}
class CreateResultService {
    async execute({ userId, assessmentId, answers }) {
        const userExists = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!userExists)
            throw new Error("User does not exist");
        const assessmentExists = await prisma_1.default.assessment.findFirst({
            where: {
                id: assessmentId,
            },
        });
        if (!assessmentExists)
            throw new Error("Assessment does not exist");
        if (!allQuestionsExist(answers.map((a) => a.assessmentQuestionId))) {
            throw new Error("One or more questions do not exist");
        }
        if (!allChoicesExist(answers.map((a) => a.assessmentQuestionChoiceId))) {
            throw new Error("One or more choices do not exist");
        }
        const result = await prisma_1.default.assessmentResult.create({
            data: {
                userId,
                assessmentId,
            },
            select: {
                id: true,
                userId: true,
                assessmentId: true,
            },
        });
        await prisma_1.default.assessmentQuestionAnswer.createMany({
            data: answers.map((a) => ({
                userId: userId,
                assessmentQuestionId: a.assessmentQuestionId,
                assessmentQuestionChoiceId: a.assessmentQuestionChoiceId,
                assessmentResultId: result.id,
            })),
        });
        return result;
    }
}
exports.CreateResultService = CreateResultService;
