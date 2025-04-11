"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssessmentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateAssessmentService {
    async execute(data) {
        const block = await prisma_1.default.selfMonitoringBlock.findFirst({
            where: {
                id: data.selfMonitoringBlockId,
            },
        });
        if (!block)
            throw new Error("Self monitoring block does not exist");
        const assessment = await prisma_1.default.assessment.create({
            data: {
                ...data,
            },
            select: {
                id: true,
                title: true,
                summary: true,
                description: true,
                selfMonitoringBlockId: true,
            },
        });
        return assessment;
    }
}
exports.CreateAssessmentService = CreateAssessmentService;
