import { z } from "zod";

export const CreatePsychosocialFactorSchema = z.object({
  name: z.string().min(1).max(255),
  wheight: z.number().int(),
  description: z.string().min(1),
  selfMonitoringBlockId: z.string(),
});

export const UpdatePsychosocialFactorSchema = CreatePsychosocialFactorSchema;

export const PsychosocialFactorIdSchema = z.object({
  id: z.string(),
});

export type CreatePsychosocialFactorRequest = z.infer<typeof CreatePsychosocialFactorSchema>;
export type UpdatePsychosocialFactorRequest = z.infer<typeof UpdatePsychosocialFactorSchema> & { id: string };
export type PsychosocialFactorId = z.infer<typeof PsychosocialFactorIdSchema>;
