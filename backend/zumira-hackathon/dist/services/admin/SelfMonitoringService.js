"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfMonitoringAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class SelfMonitoringAdminService {
    async find(id) {
        const user = await prisma_1.default.selfMonitoringBlock.findUnique({
            where: { id }
        });
        return user;
    }
    async findAll() {
        const users = await prisma_1.default.selfMonitoringBlock.findMany();
        return users;
    }
    async create(data) {
        const user = await prisma_1.default.selfMonitoringBlock.create({ data });
        return user;
    }
    async update({ id, ...data }) {
        const user = await prisma_1.default.selfMonitoringBlock.update({
            where: { id },
            data
        });
        return user;
    }
}
exports.SelfMonitoringAdminService = SelfMonitoringAdminService;
