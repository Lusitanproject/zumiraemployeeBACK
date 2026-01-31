"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompaniesService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListCompaniesService {
    async execute() {
        const companies = await prisma_1.default.company.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: { users: true },
                },
            },
        });
        const formattedCompanies = companies.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            numberOfUsers: c._count.users,
        }));
        return { companies: formattedCompanies };
    }
}
exports.ListCompaniesService = ListCompaniesService;
