import { z } from "zod";

export const VerifyCodeFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
  code: z.string().min(6),
});

export type FormState =
  | {
      errors: {
        input?: boolean;
        code?: string;
      };
    }
  | undefined;

export type AuthResponse =
  | {
      status: "SUCCESS";
      data: Authenticated;
    }
  | {
      status: "ERROR";
      message: string;
    };

export type Authenticated = {
  name: string;
  act: string;
  role: string;
  token: string;
  expiresAt: Date;
};
