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

export type GetActsDataResponse =
  | {
      status: "SUCCESS";
      data: ActsData;
    }
  | {
      status: "ERROR";
      message: string;
    };
