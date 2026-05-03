"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsychosocialFactorAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class PsychosocialFactorAdminService {
    async find(id) {
        return await prisma_1.default.psychosocialFactor.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                wheight: true,
                description: true,
                selfMonitoringBlockId: true,
            },
        });
    }
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
    async create(data) {
        return await prisma_1.default.psychosocialFactor.create({
            data,
            select: {
                id: true,
                name: true,
                wheight: true,
                description: true,
                selfMonitoringBlockId: true,
            },
        });
    }
    async update(data) {
        const { id, ...updateData } = data;
        return await prisma_1.default.psychosocialFactor.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                wheight: true,
                description: true,
                selfMonitoringBlockId: true,
            },
        });
    }
    async delete(id) {
        return await prisma_1.default.psychosocialFactor.delete({
            where: { id },
            select: {
                id: true,
            },
        });
    }
}
exports.PsychosocialFactorAdminService = PsychosocialFactorAdminService;
