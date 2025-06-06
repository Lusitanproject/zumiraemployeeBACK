"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAiResponse = generateOpenAiResponse;
const openai_1 = __importDefault(require("openai"));
async function generateOpenAiResponse({ instructions, messages }) {
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const input = [{ role: "system", content: instructions }, ...messages].filter((item) => item.content !== undefined);
    const response = await openai.responses.create({
        model: "gpt-4.1",
        input,
    });
    return response;
}
