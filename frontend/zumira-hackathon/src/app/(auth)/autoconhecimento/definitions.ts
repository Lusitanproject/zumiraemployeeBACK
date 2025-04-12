import { z } from "zod"
import { SelfMonitoringBlockSchema } from "@/schemas"

export type MonitoringBlock = z.infer<typeof SelfMonitoringBlockSchema>

export type GetSelfMonitoringBlocks =
  | {
      status: "SUCCESS",
      data: {
        blocks: MonitoringBlock[]
      }
    }
  | { status: "ERROR", message: string }
