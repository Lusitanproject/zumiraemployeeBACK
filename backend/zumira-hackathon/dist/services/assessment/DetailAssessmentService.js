"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailAssessmentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DetailAssessmentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, assessmentId }) {
            const assessment = yield prisma_1.default.assessment.findFirst({
                where: {
                    id: assessmentId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    summary: true,
                    assessmentQuestions: {
                        select: {
                            id: true,
                            description: true,
                            index: true,
                            assessmentQuestionChoices: {
                                select: {
                                    id: true,
                                    label: true,
                                    value: true,
                                    index: true,
                                },
                            },
                        },
                    },
                    assessmentResults: {
                        where: {
                            userId: userId,
                        },
                        select: {
                            createdAt: true,
                        },
                    },
                },
            });
            if (!assessment)
                throw new Error("Assessment does not exist");
            const formattedAssesment = {
                id: assessment.id,
                title: assessment.title,
                description: assessment.description,
                assessmensQuestions: assessment.assessmentQuestions,
                lastCompleted: new Date(Math.max(...assessment.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
            };
            return formattedAssesment;
        });
    }
}
exports.DetailAssessmentService = DetailAssessmentService;
