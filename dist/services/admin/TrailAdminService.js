"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class TrailAdminService {
    async find(id) {
        const trail = await prisma_1.default.trail.findFirst({ where: { id } });
        return trail;
    }
    async findAll() {
        const trails = await prisma_1.default.trail.findMany();
        return { items: trails };
    }
    async create(data) {
        const trail = await prisma_1.default.trail.create({ data });
        return trail;
    }
    async update({ id, ...data }) {
        const trail = await prisma_1.default.trail.update({ where: { id }, data });
        return trail;
    }
}
exports.TrailAdminService = TrailAdminService;
