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

export type GetCompanies =
  | {
      status: "SUCCESS";
      data: {
        companies: Company[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };

export type GetAssessments =
  | {
      status: "SUCCESS";
      data: {
        assessments: Assessment[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };

export interface Result {
  id: string;
  user: {
    id: string;
    email: string;
    companyId: string;
  };
  assessmentResultRating: {
    risk: string;
    profile: string;
    color: string;
  };
  createdAt: Date;
  scores: {
    dimension: {
      id: string;
      acronym: string;
      name: string;
    };
    value: number;
  }[];
}

export interface Filters {
  assessmentId: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Assessment = {
  id: string;
  title: string;
  summary: string;
};
