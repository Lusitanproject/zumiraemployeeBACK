"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypeAdminService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class NotificationTypeAdminService {
    async find(notificationTypeId) {
        const type = await prisma_1.default.notificationType.findUnique({
            where: { id: notificationTypeId },
            select: {
                id: true,
                name: true,
                priority: true,
                color: true,
            },
        });
        return type;
    }
    async findAll() {
        const types = await prisma_1.default.notificationType.findMany({
            select: {
                id: true,
                name: true,
                priority: true,
                color: true,
            },
        });
        return { items: types };
    }
    async create(data) {
        const type = await prisma_1.default.notificationType.create({ data });
        return type;
    }
    async update(data) {
        const type = await prisma_1.default.notificationType.update({ where: { id: data.id }, data });
        return type;
    }
}
exports.NotificationTypeAdminService = NotificationTypeAdminService;
