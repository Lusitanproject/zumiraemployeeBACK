export type Assessment = {
  id: string;
  title: string;
  summary: string;
};

export type GetAssessmentsSuccess = {
  status: "SUCCESS";
  data: {
    assessments: Assessment[];
  };
};

export type GetAssessmentsError = {
  status: "ERROR";
  message: string;
};
