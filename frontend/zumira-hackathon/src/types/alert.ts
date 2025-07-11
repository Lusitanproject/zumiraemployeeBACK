export type Alert = {
  id: string;
  assessmentResultRating: {
    assessment: {
      id: string;
      title: string;
    };
    profile: string;
    color: string;
    risk: string;
  };
  read: boolean;
  createdAt: Date;
};
