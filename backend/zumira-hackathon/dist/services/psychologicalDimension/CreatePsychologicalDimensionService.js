"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePsychologicalDimensionService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const error_1 = require("../../error");
class CreatePsychologicalDimensionService {
    async execute({ acronym, name, selfMonitoringBlockId }) {
        const dimensionExists = await prisma_1.default.psychologicalDimension.findFirst({
            where: {
                acronym: acronym,
                name: name,
            },
        });
        if (dimensionExists)
            throw new error_1.PublicError("Dimensão já existe");
        const newDimension = await prisma_1.default.psychologicalDimension.create({
            data: {
                acronym,
                name,
                selfMonitoringBlockId,
            },
            select: {
                id: true,
                acronym: true,
                name: true,
            },
        });
        return newDimension;
    }
}
exports.CreatePsychologicalDimensionService = CreatePsychologicalDimensionService;
