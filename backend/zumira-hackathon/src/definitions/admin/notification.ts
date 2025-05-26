import { z } from "zod";

export const CreateNotificationTypeSchema = z.object({
  name: z.string().nonempty(),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: "Color must be in hexadecimal",
  }),
  priority: z.number().int(),
});

export const UpdateNotificationTypeSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nonempty(),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
    message: "Color must be in hexadecimal",
  }),
  priority: z.number().int(),
});

export type CreateNotificationTypeRequest = z.infer<typeof CreateNotificationTypeSchema>;
export type UpdateNotificationTypeRequest = z.infer<typeof UpdateNotificationTypeSchema>;
