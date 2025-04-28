export type CompanyFeedback = {
  id: string;
  text: string;
  companyId: string;
  assessmentId: string;
  respondents: number;
  createdAt: string;
  updatedAt: string;
  assessment: {
    id: string;
    title: string;
    summary: string;
    description: string;
    userFeedbackInstructions: string | null;
    companyFeedbackInstructions: string | null;
    operationType: string;
    selfMonitoringBlockId: string;
    nationalityId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetCompanyFeedbacks =
  | {
      status: "SUCCESS";
      data: { items: CompanyFeedback[] };
    }
  | {
      status: "ERROR";
      message: string;
    };
