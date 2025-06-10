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

export interface Filters {
  assessmentId: string;
  companyId?: string;
}

export interface Company {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  updatedAt: Date;
}

export type Assessment = {
  id: string;
  title: string;
  summary: string;
};
