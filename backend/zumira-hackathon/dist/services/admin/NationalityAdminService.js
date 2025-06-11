"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NationalityAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class NationalityAdminService {
    async find(id) {
        return await prisma_1.default.nationality.findUnique({
            where: { id },
            select: {
                id: true,
                acronym: true,
                name: true,
            },
        });
    }
    async findAll() {
        const nationalities = await prisma_1.default.nationality.findMany({
            select: {
                id: true,
                acronym: true,
                name: true,
            },
        });
        return { items: nationalities };
    }
    async create(data) {
        return await prisma_1.default.nationality.create({ data });
    }
    async update(data) {
        return await prisma_1.default.nationality.update({ where: { id: data.id }, data });
    }
    async delete(id) {
        return await prisma_1.default.nationality.delete({ where: { id } });
    }
}
exports.NationalityAdminService = NationalityAdminService;
