import { z } from "zod";

import { NotificationTypeSchema, UserSchema } from "@/schemas";

export type User = z.infer<typeof UserSchema>;

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const ManageNotificationSchema = z
  .object({
    title: z.string().nonempty(),
    summary: z.string().nonempty(),
    content: z.string().nonempty().optional().nullable(),
    actionUrl: z.string().nonempty().optional().nullable(),
    notificationTypeId: z.string().cuid(),
  })
  .refine((data) => !(!data.content?.length && !data.actionUrl?.length), {
    message: "String must contain at least 1 character(s)",
    path: ["contentOrActionUrl"],
  });

export type ManageNotification = z.infer<typeof ManageNotificationSchema>;

export const INITIAL_VALUE: ManageNotification = {
  title: "",
  summary: "",
  content: undefined,
  actionUrl: undefined,
  notificationTypeId: "",
};

export type FormErrors = {
  title?: string[];
  summary?: string[];
  content?: string[];
  actionUrl?: string[];
  notificationTypeId?: string[];
  contentOrActionUrl?: string[];
} | null;
