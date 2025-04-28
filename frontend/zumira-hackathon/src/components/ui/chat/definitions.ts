export type ChatMessage = {
  content: string;
  role: "user" | "assistant";
  error?: string;
};

export type ChatResponse = { text: string };
