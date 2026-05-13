"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NationalityService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class NationalityService {
    async list() {
        const nationalities = await prisma_1.default.nationality.findMany({
            select: { id: true, acronym: true, name: true },
        });
        return { items: nationalities };
    }
}
exports.NationalityService = NationalityService;
