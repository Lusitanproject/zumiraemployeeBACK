"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNationalitiesService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListNationalitiesService {
    async execute() {
        const nationalities = await prisma_1.default.nationality.findMany({
            select: {
                id: true,
                acronymn: true,
                name: true,
            },
        });
        return { items: nationalities };
    }
}
exports.ListNationalitiesService = ListNationalitiesService;
