import { z } from "zod";

export const CreateNotificationSchema = z.object({
  title: z.string().nonempty(),
  summary: z.string().nonempty(),
  content: z.string().nonempty(),
  notificationTypeId: z.string().cuid(),
  userIds: z.array(z.string().uuid()),
});

export const ListNotificationsSchema = z.object({
  filter: z.enum(["recent", "unread"] as const),
});

export const NotificationIdSchema = z.object({
  notificationId: z.string().cuid(),
});

export const EditNotificationSchema = z.object({
  notificationId: z.string().cuid(),
  title: z.string().nonempty(),
  summary: z.string().nonempty(),
  content: z.string().nonempty(),
  notificationTypeId: z.string().cuid(),
});

export type CreateNotificationRequest = z.infer<typeof CreateNotificationSchema>;

export type ListNotificationsRequest = { userId: string } & z.infer<typeof ListNotificationsSchema>;

export type ReadNotificationRequest = { userId: string } & z.infer<typeof NotificationIdSchema>;

export type DeleteNotificationRequest = z.infer<typeof NotificationIdSchema>;

export type DetailNotificationRequest = z.infer<typeof NotificationIdSchema>;

export type EditNotificationRequest = z.infer<typeof EditNotificationSchema>;
