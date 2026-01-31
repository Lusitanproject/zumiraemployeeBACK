"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListResultsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListResultsService {
    async execute(userId) {
        const results = await prisma_1.default.assessmentResult.findMany({
            where: {
                userId,
            },
            include: {
                assessment: {
                    select: {
                        id: true,
                        title: true,
                        summary: true,
                    },
                },
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
}
exports.ListResultsService = ListResultsService;
