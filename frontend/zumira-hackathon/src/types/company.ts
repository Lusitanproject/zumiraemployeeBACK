export interface Company {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  updatedAt: Date;
}

export interface CompanyFeedback {
  createdAt: Date;
  respondants: number;
  text: string;
}
