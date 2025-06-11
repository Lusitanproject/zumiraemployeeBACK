export interface Message {
  content: string;
  createdAt: Date;
  role: "user" | "assistant";
  updatedAt: Date;
}

export interface ActConversation {
  actChatbot: {
    id: string;
    description: string;
    icon: string;
    name: string;
  };
  id: string;
  messages: Message[];
  title: string;
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
