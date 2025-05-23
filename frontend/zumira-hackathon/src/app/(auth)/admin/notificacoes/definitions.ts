export type NotificationType = {
  id: string;
  name: string;
  priority: number;
  color: string;
};

export type Notification = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  actionUrl?: string;
  notificationType: NotificationType;
};

export type GetNotifications =
  | {
      status: "SUCCESS";
      data: {
        notifications: Notification[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };

export type GetNotificationTypes =
  | {
      status: "SUCCESS";
      data: {
        items: NotificationType[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };
