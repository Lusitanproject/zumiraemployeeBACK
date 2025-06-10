export type Notification = {
  id: string;
  title: string;
  summary: string;
  actionUrl?: string;
  read: boolean;
  receivedAt: Date;
  notificationType: {
    color: string;
    priority: number;
  };
};

export type GetNotificationsSuccess = {
  status: "SUCCESS";
  data: {
    notifications: Notification[];
  };
};

export type GetNotificationsError = {
  status: "ERROR";
  message: string;
};

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

export type GetAlerts =
  | {
      status: "SUCCESS";
      data: { items: Alert[] };
    }
  | {
      status: "ERROR";
      message: string;
    };
