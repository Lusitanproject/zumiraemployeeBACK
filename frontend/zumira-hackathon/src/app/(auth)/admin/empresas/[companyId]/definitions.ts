import { z } from "zod";
import { CompanySchema } from "@/schemas";

export type Company = z.infer<typeof CompanySchema>;

export const ManageCompanySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type ManageCompany = z.infer<typeof ManageCompanySchema>;

export const INITIAL_VALUE: ManageCompany = {
  name: "",
  email: "",
};

export type FormErrors = {
  name?: string[];
  email?: string[];
} | null;

export type GetCompanySuccess = {
  status: "SUCCESS";
  data: Company;
};

export type GetCompanyError = {
  status: "ERROR";
  message: string;
};

export type GetCompanyResponse = GetCompanySuccess | GetCompanyError;
