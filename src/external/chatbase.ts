// Types based on Chatbase API v1 OpenAPI schema
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text";
  created_at: string;
}

interface Conversation {
  id: string;
  chatbot_id: string;
  created_at: string;
  updated_at: string;
  form_submission?: {
    name: string;
    phone: string;
  };
  source: "api" | "website" | "whatsapp" | "slack" | "messenger" | "instagram";
  messages: ChatMessage[];
}

interface GetConversationsResponse {
  data: Conversation[];
}

interface GetConversationsParams {
  chatbotId: string;
  filteredSources?: string;
  startDate?: string;
  endDate?: string;
  page?: string | number;
  size?: string | number;
}

export class ChatbaseApi {
  private baseUrl = "https://www.chatbase.co/api/v1";
  private apiKey: string;

  constructor() {
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
  async getConversationsFromChatbot(params: GetConversationsParams): Promise<Conversation[]> {
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

      const data: GetConversationsResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error("Failed to fetch conversations from Chatbase:", error);
      throw error;
    }
  }
}
