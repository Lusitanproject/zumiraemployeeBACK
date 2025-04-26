import { z } from "zod";

export const SignupFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
      };
    }
  | undefined;

export type EmailAuthError = {
  status: "ERROR";
  message: string;
};

export type EmailAuthSuccess = {
  status: "SUCCESS";
  data: unknown;
};

export type EmailAuthResponse = EmailAuthError | EmailAuthSuccess;
