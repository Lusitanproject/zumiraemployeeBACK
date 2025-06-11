import { z } from "zod";

export const RegisterFormSchema = z.object({
  name: z.string().nonempty({ message: "Nome é obrigatório." }),
  email: z.string().email({ message: "E-mail inválido." }),
  birthdate: z.string({ required_error: "Data de nascimento é obrigatória." }),
  nationalityId: z.string().cuid({ message: "Nacionalidade é obrigatória." }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"] as const).optional(),
  occupation: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val?.length ? val : undefined)),
});

export type RegisterFormState = z.infer<typeof RegisterFormSchema>;

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        birthdate?: string[];
        nationalityId?: string[];
        gender?: string[];
        occupation?: string[];
        response?: string[];
      };
    }
  | undefined;

export type RegisterResponse =
  | {
      status: "SUCCESS";
      data: unknown;
    }
  | {
      status: "ERROR";
      message: string;
    };

export type Nationality = {
  id: string;
  acronym: string;
  name: string;
};

export type GetNationalitiesResponse =
  | {
      status: "SUCCES";
      data: { items: Nationality[] };
    }
  | {
      status: "ERROR";
      message: string;
    };
