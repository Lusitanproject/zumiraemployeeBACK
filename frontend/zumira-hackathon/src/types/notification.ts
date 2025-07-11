export type Notification = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  actionUrl?: string;
  read: boolean;
  receivedAt: Date;
  notificationType: NotificationType;
};

export type NotificationType = {
  id: string;
  name: string;
  priority: number;
  color: string;
};
