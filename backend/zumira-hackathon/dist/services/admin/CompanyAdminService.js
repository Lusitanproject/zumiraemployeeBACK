"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CompanyAdminService {
    async find(companyId) {
        const company = await prisma_1.default.company.findFirst({
            where: { id: companyId }
        });
        return company;
    }
    async findAll() {
        const companies = await prisma_1.default.company.findMany();
        return companies;
    }
    async create(data) {
        const company = await prisma_1.default.company.create({ data });
        return company;
    }
}
exports.CompanyAdminService = CompanyAdminService;
