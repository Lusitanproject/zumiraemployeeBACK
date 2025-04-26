import { z } from "zod";

export const VerifyCodeFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
  code: z.string().min(6),
});

export type FormState =
  | {
      errors?: {
        email?: string[];
        code?: string[];
      };
    }
  | undefined;

export type AuthResponse = {
  type: "SUCCESS";
  data: Authenticated;
};

export type Authenticated = {
  name: string;
  role: string;
  token: string;
  expiresAt: Date;
};
