"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstActChatbot = getFirstActChatbot;
const prisma_1 = __importDefault(require("../prisma"));
async function getFirstActChatbot() {
    const bots = await prisma_1.default.actChatbot.findMany();
    return bots.filter((b1) => !bots.some((b2) => b2.nextActChatbotId === b1.id))[0];
}
