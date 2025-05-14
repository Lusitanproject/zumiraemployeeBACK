export type Result = {
  id: string;
  feedback: null | string;
  resultRating: null;
  assessment: {
    id: string;
    title: string;
    summary: string;
    psychologicalDimensions: string[];
  };
  answeredAt: string;
};

export type GetResults = {
  status: "SUCCESS" | "ERROR";
  data?: {
    items: Result[];
  };
  message?: string;
};
