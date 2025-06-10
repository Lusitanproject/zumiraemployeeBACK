export type ActChatbot = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  icon: string;
  nextActChatbotId: string | null;
};

export type GetActChatbots =
  | {
      status: "SUCCESS";
      data: {
        items: ActChatbot[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };
