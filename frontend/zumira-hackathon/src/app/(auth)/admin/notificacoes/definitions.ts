export type Notification = {
  id: string;
  title: string;
  summary: string;
  content: string;
  notificationType: {
    id: string;
    name: string;
    priority: number;
    color: string;
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
