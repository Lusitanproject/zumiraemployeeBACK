"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateCompanyService {
    async execute({ name, email, trailId }) {
        const company = await prisma_1.default.company.create({
            data: {
                name,
                email,
                trailId,
            },
        });
        return company;
    }
}
exports.CreateCompanyService = CreateCompanyService;
