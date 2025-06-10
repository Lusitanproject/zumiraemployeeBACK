"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentResultAdminService = void 0;
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
}
exports.AssessmentResultAdminService = AssessmentResultAdminService;
