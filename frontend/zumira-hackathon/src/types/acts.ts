export interface ActsData {
  chatbots: {
    id: string;
    name: string;
    description: string;
    icon: string;
    nextActChatbotId: null | string;
  }[];
  conversations: {
    id: string;
    title: string;
    actChatbotId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface ActMessage {
  content: string;
  createdAt: Date;
  role: "user" | "assistant";
  updatedAt: Date;
  error?: boolean;
}

export interface ActConversation {
  actChatbot: {
    id: string;
    description: string;
    icon: string;
    name: string;
  };
  id: string;
  messages: ActMessage[];
  title: string;
}

export type ActChatbot = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  icon: string;
  nextActChatbotId: string | null;
  actConversations: { id: string; title: string }[];
};
