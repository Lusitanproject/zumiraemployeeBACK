"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuestionsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateQuestionsService {
    async execute({ assessmentId, questions }) {
        const startTime = new Date();
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
                const storedQuestion = oldQuestions.find((q) => q.id === question.id);
                const updated = (storedQuestion === null || storedQuestion === void 0 ? void 0 : storedQuestion.description) !== question.description ||
                    storedQuestion.index !== question.index ||
                    storedQuestion.psychologicalDimensionId !== question.psychologicalDimensionId;
                if (updated) {
                    await prisma_1.default.assessmentQuestion.update({
                        where: {
                            id: question.id,
                        },
                        data: {
                            description: question.description,
                            index: question.index,
                            psychologicalDimensionId: question.psychologicalDimensionId,
                        },
                    });
                }
                for (const choice of question.choices) {
                    if (!choice.id) {
                        // Create new choices
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
                        const storedChoice = oldChoices.find((c) => c.id === choice.id);
                        const updated = (storedChoice === null || storedChoice === void 0 ? void 0 : storedChoice.index) !== choice.index ||
                            storedChoice.label !== choice.label ||
                            storedChoice.value !== choice.value;
                        if (updated) {
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
        }
        await prisma_1.default.assessmentQuestion.deleteMany({
            where: {
                id: {
                    in: deletedQuestions.map((q) => q.id).filter((id) => id !== undefined),
                },
            },
        });
        await prisma_1.default.assessmentQuestionChoice.deleteMany({
            where: {
                id: {
                    in: deletedChoices.map((c) => c.id).filter((id) => id !== undefined),
                },
            },
        });
        const endTime = new Date();
        const timeDiffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
        console.log(`Updated assessment ${assessmentId} questions in ${timeDiffInSeconds} seconds`);
    }
}
exports.UpdateQuestionsService = UpdateQuestionsService;
