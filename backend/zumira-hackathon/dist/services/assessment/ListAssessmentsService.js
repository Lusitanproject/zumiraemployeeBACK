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
exports.ListAssessmentsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListAssessmentsService {
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield prisma_1.default.user.findFirst({
                where: {
                    id: userId,
                },
            });
            if (!userExists)
                throw new Error("User does not exist");
            const assessments = yield prisma_1.default.assessment.findMany({
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    selfMonitoringBlock: {
                        select: {
                            id: true,
                            title: true,
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
            const formattedAssessments = assessments.map((a) => ({
                id: a.id,
                title: a.title,
                summary: a.summary,
                selfMonitoring: a.selfMonitoringBlock,
                lastCompleted: new Date(Math.max(...a.assessmentResults.map((r) => new Date(r.createdAt).getTime()))),
            }));
            return { assessments: formattedAssessments };
        });
    }
}
exports.ListAssessmentsService = ListAssessmentsService;
