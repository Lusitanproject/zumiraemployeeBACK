import { z } from "zod";

import { NotificationTypeSchema } from "@/schemas";

export const ManageNotificationTypeSchema = z.object({
  name: z.string().nonempty(),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  priority: z.number().int(),
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export type ManageNotificationType = z.infer<typeof ManageNotificationTypeSchema>;

export const INITIAL_VALUE: ManageNotificationType = {
  name: "",
  color: "#FFFFFF",
  priority: 0,
};

export type FormErrors = {
  name?: string[];
  color?: string[];
  priority?: string[];
} | null;

export type GetNotificationType =
  | {
      status: "SUCCESS";
      data: NotificationType;
    }
  | {
      status: "ERROR";
      message: string;
    };
