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
    index: number;
    locked: boolean;
    current: boolean;
  }[];
  progress: number;
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
    initialMessage?: string;
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
  index: number;
  actChapters: { id: string; title: string }[];
  trailId: string;
};
