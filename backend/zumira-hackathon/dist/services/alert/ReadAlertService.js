"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadAlertService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class ReadAlertService {
    async execute({ id }) {
        const alert = await prisma_1.default.alert.findFirst({
            where: {
                id,
            },
            select: {
                assessmentResult: {
                    select: {
                        assessment: {
                            select: {
                                id: true,
                            },
                        },
                        userId: true,
                    },
                },
            },
        });
        if (!alert)
            throw new error_1.PublicError("Alerta não existe");
        await prisma_1.default.alert.updateMany({
            where: {
                assessmentResult: {
                    assessmentId: alert.assessmentResult.assessment.id,
                    userId: alert.assessmentResult.userId,
                },
            },
            data: {
                read: true,
            },
        });
        return {};
    }
}
exports.ReadAlertService = ReadAlertService;
