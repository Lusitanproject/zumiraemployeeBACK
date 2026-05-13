"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const error_1 = require("../../error");
const prisma_1 = __importDefault(require("../../prisma"));
class AlertService {
    async list({ userId, filter, max }) {
        const alerts = await prisma_1.default.alert.findMany({
            where: {
                assessmentResult: { userId },
                read: filter === "recent" ? undefined : false,
            },
            select: {
                id: true,
                assessmentResultRating: {
                    select: {
                        assessment: { select: { id: true, title: true } },
                        profile: true,
                        color: true,
                        risk: true,
                    },
                },
                read: true,
                createdAt: true,
            },
            take: max,
            orderBy: { createdAt: "desc" },
        });
        const latestAlertsMap = new Map();
        for (const alert of alerts) {
            const assessmentId = alert.assessmentResultRating.assessment.id;
            const existing = latestAlertsMap.get(assessmentId);
            if (!existing || alert.createdAt > existing.createdAt) {
                latestAlertsMap.set(assessmentId, alert);
            }
        }
        return { items: Array.from(latestAlertsMap.values()) };
    }
    async read({ id }) {
        const alert = await prisma_1.default.alert.findFirst({
            where: { id },
            select: {
                assessmentResult: {
                    select: {
                        assessment: { select: { id: true } },
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
            data: { read: true },
        });
        return {};
    }
}
exports.AlertService = AlertService;
