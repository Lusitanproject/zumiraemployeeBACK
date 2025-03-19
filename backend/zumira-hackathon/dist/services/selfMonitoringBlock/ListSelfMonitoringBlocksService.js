"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSelfMonitoringBlocksService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListSelfMonitoringBlocksService {
    async execute() {
        const blocks = await prisma_1.default.selfMonitoringBlock.findMany({
            select: {
                id: true,
                title: true,
                summary: true,
                icon: true
            },
        });
        return { blocks };
    }
}
exports.ListSelfMonitoringBlocksService = ListSelfMonitoringBlocksService;
