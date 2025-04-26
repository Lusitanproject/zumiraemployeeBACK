import { z } from "zod";

export function parseZodError(error: z.ZodError) {
  // Retorna no formato "[campo_1]: mensagem de erro; [campo_2.campo_2_1]: mensagem de erro ..."
  return error.errors.map((e) => `[${e.path.join(".")}]: ${e.message}`).join("; ");
}
