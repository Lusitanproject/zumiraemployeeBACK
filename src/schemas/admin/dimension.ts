import { z } from "zod";

export const CreateDimensionSchema = z.object({
  acronym: z.string().min(1),
  name: z.string().min(1),
  selfMonitoringBlockId: z.string().cuid(),
});

export const EditDimensionSchema = z.object({
  id: z.string().uuid(),
  acronym: z.string().min(1),
  name: z.string().min(1),
  selfMonitoringBlockId: z.string().cuid(),
});
