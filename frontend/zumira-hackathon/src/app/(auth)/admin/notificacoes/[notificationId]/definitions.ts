import { z } from "zod";
import { NotificationTypeSchema } from "@/schemas";
import { Notification } from "../definitions";

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const ManageNotificationSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  notificationTypeId: z.string().cuid(),
});

export type ManageNotification = z.infer<typeof ManageNotificationSchema>;

export const INITIAL_VALUE: ManageNotification = {
  title: "",
  summary: "",
  content: "",
  notificationTypeId: "",
};

export type FormErrors = {
  title?: string[];
  summary?: string[];
  content?: string[];
  notificationTypeId?: string[];
} | null;

export type GetNotificationSuccess = {
  status: "SUCCESS";
  data: Notification;
};

export type GetNotificationError = {
  status: "ERROR";
  message: string;
};

export type GetNotificationTypesSuccess = {
  status: "SUCCESS";
  data: {
    types: NotificationType[];
  };
};

export type GetNotificationTypesError = {
  status: "ERROR";
  message: string;
};

export type GetNotificationResponse = GetNotificationError | GetNotificationSuccess;
export type GetNotificationTypesResponse = GetNotificationTypesError | GetNotificationTypesSuccess;
