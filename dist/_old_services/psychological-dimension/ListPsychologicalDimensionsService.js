"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPsychologicalDimensionsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListPsychologicalDimensionsService {
    async execute() {
        const dimensions = await prisma_1.default.psychologicalDimension.findMany({
            select: {
                id: true,
                acronym: true,
                name: true,
            },
        });
        return { dimensions };
    }
}
exports.ListPsychologicalDimensionsService = ListPsychologicalDimensionsService;
