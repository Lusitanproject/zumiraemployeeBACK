import { z } from "zod";

export const CreateSelfMonitoringBlockSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  icon: z.string(),
});

export const EditSelfMonitoringBlockSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().optional(),
  icon: z.string().optional(),
});

export const FindSelfMonitoringSchema = z.object({
  id: z.string().cuid(),
});
