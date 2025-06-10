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
