import { z } from "zod";
import { CompanySchema, RoleSchema, UserSchema } from "@/schemas";

export type User = z.infer<typeof UserSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Role = z.infer<typeof RoleSchema>;

export const ManageUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  roleId: z.string().uuid(),
  companyId: z.string().cuid().optional(),
});

export type ManageUser = z.infer<typeof ManageUserSchema>;

export const INITIAL_VALUE: ManageUser = {
  name: "",
  email: "",
  roleId: "",
  companyId: undefined,
};

export type FormErrors = {
  name?: string[];
  email?: string[];
  roleId?: string[];
} | null;

export type GetUserSuccess = {
  status: "SUCCESS";
  data: User;
};

export type GetUserError = {
  status: "ERROR";
  message: string;
};

export type GetCompaniesSuccess = {
  status: "SUCCESS";
  data: {
    companies: Company[];
  };
};

export type GetCompanyError = {
  status: "ERROR";
  message: string;
};

export type GetRolesSuccess = {
  status: "SUCCESS";
  data: {
    roles: Role[];
  };
};

export type GetRolesError = {
  status: "ERROR";
  message: string;
};

export type GetCompaniesResponse = GetCompanyError | GetCompaniesSuccess;
export type GetUserResponse = GetUserError | GetUserSuccess;
export type GetRolesResponse = GetRolesError | GetRolesSuccess;
