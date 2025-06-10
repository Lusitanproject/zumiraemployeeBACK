export interface Message {
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  updatedAt: Date;
}

export interface ActConversation {
  id: string;
  title: string;
  actChatbot: {
    id: string;
    description: string;
    icon: string;
    name: string;
  };
  messages: Message[];
}

export enum Role {
  System = "SYSTEM",
  User = "USER",
}

export type GetActConversationResponse =
  | {
      status: "SUCCESS";
      data: ActConversation;
    }
  | {
      status: "ERROR";
      message: string;
    };

export type GenerateResponseResponse =
  | {
      status: "SUCCESS";
      data: string;
    }
  | {
      status: "ERROR";
      message: string;
    };
