export type Result = {
  id: string;
  feedback: string;
  resultRatingId: null;
  userId: string;
  assessmentId: string;
  assessment: {
    id: string;
    title: string;
    summary: string;
  };
};

export type GetResults =
  | {
      status: "SUCCESS";
      data: {
        items: Result[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };
