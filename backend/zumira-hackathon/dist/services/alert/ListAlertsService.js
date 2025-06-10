"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlertsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListAlertsService {
    async execute(userId) {
        const alerts = await prisma_1.default.alert.findMany({
            where: {
                assessmentResult: {
                    userId,
                },
                read: {
                    not: true,
                },
            },
            select: {
                id: true,
                assessmentResultRating: {
                    select: {
                        assessment: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                        profile: true,
                        color: true,
                        risk: true,
                    },
                },
                read: true,
                createdAt: true,
            },
        });
        const latestAlertsMap = new Map();
        for (const alert of alerts) {
            const assessmentId = alert.assessmentResultRating.assessment.id;
            const existing = latestAlertsMap.get(assessmentId);
            if (!existing || alert.createdAt > existing.createdAt) {
                latestAlertsMap.set(assessmentId, alert);
            }
        }
        const latestAlerts = Array.from(latestAlertsMap.values());
        return { items: latestAlerts };
    }
}
exports.ListAlertsService = ListAlertsService;
