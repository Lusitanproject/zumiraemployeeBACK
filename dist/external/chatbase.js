"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbaseApi = void 0;
class ChatbaseApi {
    constructor() {
        this.baseUrl = "https://www.chatbase.co/api/v1";
        const key = process.env.CHATBASE_SECRET_KEY;
        if (!key) {
            throw new Error("Environment variable CHATBASE_SECRET_KEY is not set");
        }
        this.apiKey = key;
    }
    /**
     * Retrieves conversation history for a specific chatbot
     * @param params - Query parameters for filtering and pagination
     * @returns Promise with array of conversations
     */
    async getConversationsFromChatbot(params) {
        try {
            const queryParams = new URLSearchParams();
            // Add required parameter
            queryParams.append("chatbotId", params.chatbotId);
            // Add optional parameters
            if (params.filteredSources) {
                queryParams.append("filteredSources", params.filteredSources);
            }
            if (params.startDate) {
                queryParams.append("startDate", params.startDate);
            }
            if (params.endDate) {
                queryParams.append("endDate", params.endDate);
            }
            if (params.page !== undefined) {
                queryParams.append("page", String(params.page));
            }
            if (params.size !== undefined) {
                queryParams.append("size", String(params.size));
            }
            const url = `${this.baseUrl}/get-conversations?${queryParams.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Chatbase API error: ${response.status} - ${errorData.message || response.statusText}`);
            }
            const data = await response.json();
            return data.data;
        }
        catch (error) {
            console.error("Failed to fetch conversations from Chatbase:", error);
            throw error;
        }
    }
}
exports.ChatbaseApi = ChatbaseApi;
