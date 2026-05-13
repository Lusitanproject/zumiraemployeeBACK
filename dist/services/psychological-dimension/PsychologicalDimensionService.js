"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsychologicalDimensionService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class PsychologicalDimensionService {
    async create({ acronym, name, selfMonitoringBlockId }) {
        const dimensionExists = await prisma_1.default.psychologicalDimension.findFirst({
            where: { acronym, name },
        });
        if (dimensionExists)
            throw new error_1.PublicError("Dimensão já existe");
        const newDimension = await prisma_1.default.psychologicalDimension.create({
            data: { acronym, name, selfMonitoringBlockId },
            select: { id: true, acronym: true, name: true },
        });
        return newDimension;
    }
    async list() {
        const dimensions = await prisma_1.default.psychologicalDimension.findMany({
            select: { id: true, acronym: true, name: true },
        });
        return { dimensions };
    }
}
exports.PsychologicalDimensionService = PsychologicalDimensionService;
