import { z } from "zod";
import { NationalitySchema, SelfMonitoringBlockSchema } from "@/schemas";

export type MonitoringBlock = z.infer<typeof SelfMonitoringBlockSchema>;
export type Nationality = z.infer<typeof NationalitySchema>;

export type GetSelfMonitoringBlocks =
  | {
      status: "SUCCESS";
      data: {
        blocks: MonitoringBlock[];
      };
    }
  | { status: "ERROR"; message: string };

export type GetNationalities =
  | {
      status: "SUCCESS";
      data: {
        items: Nationality[];
      };
    }
  | { status: "ERROR"; message: string };
