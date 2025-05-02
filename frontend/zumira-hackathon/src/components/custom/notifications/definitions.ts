export type Notification = {
  id: string;
  title: string;
  summary: string;
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
