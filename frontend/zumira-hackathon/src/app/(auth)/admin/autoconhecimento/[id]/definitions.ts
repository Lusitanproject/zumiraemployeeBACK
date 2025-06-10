import { z } from "zod";

import { SelfMonitoringBlockSchema } from "@/schemas";

export type MonitoringBlock = z.infer<typeof SelfMonitoringBlockSchema>;

export const ManageMonitoringBlockSchema = z.object({
  title: z.string().min(1, "O campo título é obrigatório"),
  summary: z.string().optional(),
  icon: z.string().optional(),
  openaiAssistantId: z.string().optional(),
});

export type ManageMonitoringBlock = z.infer<typeof ManageMonitoringBlockSchema>;

export const INITIAL_VALUE: ManageMonitoringBlock = {
  icon: "",
  summary: "",
  title: "",
};

export type FormErrors = {
  title?: string[];
  summary?: string[];
  icon?: string[];
} | null;

export type SelfMonitoringBlockSuccess = {
  status: "SUCCESS";
  data: MonitoringBlock;
};

export type SelfMonitoringBlockError = {
  status: "ERROR";
  message: string;
};

export type SelfMonitoringResponse = SelfMonitoringBlockSuccess | SelfMonitoringBlockError;
