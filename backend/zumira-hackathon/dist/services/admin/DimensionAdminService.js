"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DimensionAdminService {
    async find(dimensionId) {
        const dimension = await prisma_1.default.psychologicalDimension.findUnique({
            where: { id: dimensionId },
            select: {
                id: true,
                acronym: true,
                name: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        return dimension;
    }
    async findAll() {
        const dimension = await prisma_1.default.psychologicalDimension.findMany({
            select: {
                id: true,
                acronym: true,
                name: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        return dimension;
    }
    async findBySelfMonitoring(selfMonitoringBlockId) {
        const dimension = await prisma_1.default.psychologicalDimension.findMany({
            where: { selfMonitoringBlockId },
            select: {
                id: true,
                acronym: true,
                name: true,
                selfMonitoringBlock: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        return dimension;
    }
    async create(data) {
        const dimension = await prisma_1.default.psychologicalDimension.create({ data });
        return dimension;
    }
}
exports.DimensionAdminService = DimensionAdminService;
