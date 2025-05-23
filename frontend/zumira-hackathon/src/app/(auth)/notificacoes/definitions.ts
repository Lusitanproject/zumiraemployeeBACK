export type Notification = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  actionUrl?: string;
  read: boolean;
  receivedAt: Date;
  notificationType: {
    color: string;
    priority: number;
  };
};

export type NotificationFull = Notification & { content: string };

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

export type DetailNotificationSuccess = {
  status: "SUCCESS";
  data: NotificationFull;
};

export type DetailNotificationError = {
  status: "ERROR";
  message: string;
};
