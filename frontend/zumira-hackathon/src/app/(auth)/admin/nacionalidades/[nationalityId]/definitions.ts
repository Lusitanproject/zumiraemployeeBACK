import { z } from "zod";

import { NationalitySchema } from "@/schemas";

export type Nationality = z.infer<typeof NationalitySchema>;

export const ManageNationalitySchema = z.object({
  acronym: z.string().min(2).max(5),
  name: z.string().min(1).max(100),
});

export type ManageNationality = z.infer<typeof ManageNationalitySchema>;

export const INITIAL_VALUE: ManageNationality = {
  name: "",
  acronym: "",
};

export type FormErrors = {
  acronym?: string[];
  name?: string[];
  selfMonitoringBlockId?: string[];
} | null;

export type GetNationalityResponse =
  | {
      status: "SUCCESS";
      data: Nationality;
    }
  | {
      status: "ERROR";
      message: string;
    };
