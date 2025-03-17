"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssessmentService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateAssessmentService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ title, summary, description, selfMonitoringBlockId }) {
            const block = yield prisma_1.default.selfMonitoringBlock.findFirst({
                where: {
                    id: selfMonitoringBlockId,
                },
            });
            if (!block)
                throw new Error("Asssessment scale does not exist");
            const assessment = yield prisma_1.default.assessment.create({
                data: {
                    title,
                    summary,
                    description,
                    selfMonitoringBlockId,
                },
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    description: true,
                    selfMonitoringBlockId: true,
                },
            });
            return assessment;
        });
    }
}
exports.CreateAssessmentService = CreateAssessmentService;
