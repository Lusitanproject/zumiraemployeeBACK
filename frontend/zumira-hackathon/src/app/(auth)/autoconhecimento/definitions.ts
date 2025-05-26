export type Assessment = {
  id: string;
  title: string;
  summary: string;
  scale: {
    id: string;
    name: string;
  };
  selfMonitoring: {
    id: string;
    title: string;
  };
  lastCompleted: Date | null;
};

export type SelfMonitoringBlock = {
  id: string;
  title: string;
};

export type GetAssessmentsSuccess = {
  status: "SUCCESS";
  data: {
    assessments: Assessment[];
  };
};

export type GetSelfMonitoringBlocks = {
  status: "SUCCESS";
  data: {
    blocks: SelfMonitoringBlock[];
  };
};
