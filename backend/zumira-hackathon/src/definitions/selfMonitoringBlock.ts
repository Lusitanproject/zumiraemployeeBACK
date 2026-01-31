import { z } from "zod";

export const ListSelfMonitoringBlockResultsSchema = z.object({
  selfMonitoringBlockId: z.string().cuid().optional(),
});

export type ListSelfMonitoringBlockResultsRequest = { userId: string } & z.infer<
  typeof ListSelfMonitoringBlockResultsSchema
>;
