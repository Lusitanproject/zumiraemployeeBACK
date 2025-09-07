import { z } from "zod";

import { NationalitySchema } from "@/schemas";

export type Nationality = z.infer<typeof NationalitySchema>;

export const ManageTrailSchema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string().nonempty(),
  description: z.string().nonempty(),
});

export type ManageTrail = z.infer<typeof ManageTrailSchema>;

export const INITIAL_VALUE: ManageTrail = {
  title: "",
  subtitle: "",
  description: "",
};

export type FormErrors = {
  title?: string[];
  subtitle?: string[];
  description?: string[];
} | null;
