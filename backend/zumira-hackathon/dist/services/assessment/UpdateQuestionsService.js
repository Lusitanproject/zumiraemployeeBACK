"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuestionsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateQuestionsService {
    async execute({ assessmentId, questions }) {
        const oldQuestions = await prisma_1.default.assessmentQuestion.findMany({
            where: {
                assessmentId,
            },
            include: {
                assessmentQuestionChoices: true,
            },
        });
        const oldChoices = oldQuestions.map((q) => q.assessmentQuestionChoices.map((c) => c)).flat();
        const deletedQuestions = oldQuestions.filter((oldQuestion) => !questions.some((q) => oldQuestion.id === q.id));
        const deletedChoices = oldChoices.filter((oldChoice) => !questions.some((q) => q.choices.some((c) => oldChoice.id === c.id)));
        for (const question of questions) {
            if (!question.id) {
                // Create new question and choices
                console.log(`Creating question ${question.index}`);
                const createdQuestion = await prisma_1.default.assessmentQuestion.create({
                    data: {
                        assessmentId: assessmentId,
                        description: question.description,
                        index: question.index,
                        psychologicalDimensionId: question.psychologicalDimensionId,
                    },
                    select: {
                        id: true,
                        description: true,
                        index: true,
                        assessmentId: true,
                        psychologicalDimensionId: true,
                    },
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
                // Update existing question
                console.log(`Updating question ${question.index}`);
                await prisma_1.default.assessmentQuestion.update({
                    where: {
                        id: question.id,
                    },
                    data: {
                        assessmentId: assessmentId,
                        description: question.description,
                        index: question.index,
                        psychologicalDimensionId: question.psychologicalDimensionId,
                    },
                });
                for (const choice of question.choices) {
                    if (!choice.id) {
                        // Create new choices
                        console.log(`Creating choice ${question.index}:${choice.index}`);
                        await prisma_1.default.assessmentQuestionChoice.create({
                            data: {
                                index: choice.index,
                                label: choice.label,
                                value: choice.value,
                                assessmentQuestionId: question.id,
                            },
                            select: {
                                id: true,
                                label: true,
                                value: true,
                                index: true,
                                assessmentQuestionId: true,
                            },
                        });
                    }
                    else {
                        // Update existing choice
                        console.log(`Updating choice ${question.index}:${choice.index}`);
                        await prisma_1.default.assessmentQuestionChoice.update({
                            where: {
                                id: choice.id,
                            },
                            data: {
                                index: choice.index,
                                label: choice.label,
                                value: choice.value,
                            },
                        });
                    }
                }
            }
        }
        console.log(`Deleting removed questions`);
        await prisma_1.default.assessmentQuestion.deleteMany({
            where: {
                id: {
                    in: deletedQuestions.map((q) => q.id).filter((id) => id !== undefined),
                },
            },
        });
        console.log(`Deleting removed choices`);
        await prisma_1.default.assessmentQuestionChoice.deleteMany({
            where: {
                id: {
                    in: deletedChoices.map((c) => c.id).filter((id) => id !== undefined),
                },
            },
        });
    }
}
exports.UpdateQuestionsService = UpdateQuestionsService;
