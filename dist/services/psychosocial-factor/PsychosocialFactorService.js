"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsychosocialFactorService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class PsychosocialFactorService {
    async findAll() {
        const factors = await prisma_1.default.psychosocialFactor.findMany({
            select: {
                id: true,
                name: true,
                wheight: true,
                description: true,
                selfMonitoringBlockId: true,
            },
        });
        return { items: factors };
    }
}
exports.PsychosocialFactorService = PsychosocialFactorService;
