export interface ActsData {
  chapters: {
    id: string;
    title: string;
    actChatbotId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  chatbots: {
    id: string;
    name: string;
    description: string;
    icon: string;
    nextActChatbotId: null | string;
  }[];
}

export interface ActMessage {
  content: string;
  createdAt: Date;
  role: "user" | "assistant";
  updatedAt: Date;
  error?: boolean;
}

export interface ActChapter {
  actChatbot: {
    id: string;
    description: string;
    icon: string;
    name: string;
  };
  id: string;
  messages: ActMessage[];
  title: string;
  compilation?: string;
}

export type ActChatbot = {
  id: string;
  name: string;
  description: string;
  messageInstructions?: string;
  compilationInstructions?: string;
  icon: string;
  nextActChatbotId: string | null;
  actChapters: { id: string; title: string }[];
};
