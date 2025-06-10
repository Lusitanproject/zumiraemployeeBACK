export type NewConversationResponse =
  | {
      status: "SUCCESS";
      data: {
        id: string;
        actChatbot: {
          name: string;
          icon: string;
          description: string;
        };
      };
    }
  | {
      status: "ERROR";
      message: string;
    };
