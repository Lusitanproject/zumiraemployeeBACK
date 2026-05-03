"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiApi = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
class OpenAiApi {
    constructor(opts) {
        var _a;
        const key = process.env.OPENAI_API_KEY;
        if (!key) {
            throw new Error("Environment variable OPENAI_API_KEY is not set");
        }
        this.apiKey = key;
        this.client = new openai_1.default({ apiKey: this.apiKey });
        this.model = (_a = opts === null || opts === void 0 ? void 0 : opts.model) !== null && _a !== void 0 ? _a : "gpt-5.4";
    }
    async generateResponse({ instructions, messages }) {
        try {
            const input = [{ role: "system", content: instructions }, ...messages].filter((item) => !!item.content);
            const response = await this.client.responses.create({
                model: this.model,
                input,
            });
            return response;
        }
        catch (error) {
            console.error("Failed to generate OpenAI response:", error);
            throw error;
        }
    }
    async createBatch({ instructions, batchItems }) {
        try {
            const jsonl = batchItems
                .map((item) => {
                const input = [{ role: "system", content: instructions }, ...item.messages].filter((entry) => !!entry.content);
                return JSON.stringify({
                    custom_id: item.customId,
                    method: "POST",
                    url: "/v1/responses",
                    body: {
                        model: this.model,
                        input,
                    },
                });
            })
                .join("\n");
            const fileName = `/tmp/openai-batch-${Date.now()}.jsonl`;
            fs_1.default.writeFileSync(fileName, jsonl);
            const file = await this.client.files.create({
                file: fs_1.default.createReadStream(fileName),
                purpose: "batch",
            });
            const batch = await this.client.batches.create({
                input_file_id: file.id,
                endpoint: "/v1/responses",
                completion_window: "24h",
            });
            fs_1.default.unlinkSync(fileName);
            return {
                fileId: file.id,
                batchId: batch.id,
                status: batch.status,
                raw: batch,
            };
        }
        catch (error) {
            console.error("Failed to create OpenAI batch:", error);
            throw error;
        }
    }
    async retrieveBatchResult(batchId) {
        try {
            const batch = await this.client.batches.retrieve(batchId);
            if (batch.status !== "completed") {
                return {
                    batchId,
                    status: batch.status,
                    results: null,
                    raw: batch,
                };
            }
            if (!batch.output_file_id) {
                return {
                    batchId,
                    status: batch.status,
                    results: [],
                    raw: batch,
                };
            }
            const file = await this.client.files.content(batch.output_file_id);
            const text = await file.text();
            const lines = text.trim().split("\n").filter(Boolean);
            const results = lines.map((line) => {
                var _a, _b, _c, _d, _e, _f;
                const item = JSON.parse(line);
                const outputText = (_e = (_d = (_c = (_b = (_a = item.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
                return {
                    customId: (_f = item.custom_id) !== null && _f !== void 0 ? _f : null,
                    data: outputText ? JSON.parse(outputText) : null,
                    raw: item,
                };
            });
            return {
                batchId,
                status: batch.status,
                results,
                raw: batch,
            };
        }
        catch (error) {
            console.error("Failed to retrieve OpenAI batch result:", error);
            throw error;
        }
    }
}
exports.OpenAiApi = OpenAiApi;
