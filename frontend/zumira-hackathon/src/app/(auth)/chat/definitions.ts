export type Feedback = {
  id: string;
  text: string;
  assessment: {
    title: string;
    summary: string;
    description: string;
  };
};

export type GetFeedback =
  | {
      status: "SUCCESS";
      data: {
        items: Feedback[];
      };
    }
  | { status: "ERROR"; message: string };
