export interface Assessment {
  id: string;
  lastCompleted: Date;
  selfMonitoring: {
    id: string;
    title: string;
  };
  summary: string;
  title: string;
}

export interface AssessmentResult {
  assessmentResultRating: {
    risk: string;
    profile: string;
    color: string;
  };
  createdAt: Date;
  id: string;
  scores: {
    dimension: {
      id: string;
      acronym: string;
      name: string;
    };
    value: number;
  }[];
  user: {
    id: string;
    name: string;
    email: string;
    companyId: string;
  };
}
