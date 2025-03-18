import { z } from "zod";
import { PsychologicalDimensionSchema, SelfMonitoringBlockSchema } from "@/schemas";

export type Dimension = z.infer<typeof PsychologicalDimensionSchema>
export type MonitoringBlock = z.infer<typeof SelfMonitoringBlockSchema>


export const ManageDimensionSchema = z.object({
  acronym: z.string().min(1),
  name: z.string().min(1),
  selfMonitoringBlockId: z.string().cuid(),
})

export type ManageDimension = z.infer<typeof ManageDimensionSchema>

export const INITIAL_VALUE: ManageDimension = {
  acronym: "",
  name: "",
  selfMonitoringBlockId: "",
} 

export type FormErrors =
| {
  acronym?: string[]
  name?: string[]
  selfMonitoringBlockId?: string[]
}
| null

export type GetDimensionSuccess = {
  status: "SUCCESS",
  data: Dimension
}

export type GetDimensionError = {
  status: "ERROR",
  message: string
}

export type GetMonitoringSuccess = {
  status: "SUCCESS",
  data: {
    blocks: MonitoringBlock[]
  }
}

export type GetMonitoringError = {
  status: "ERROR",
  message: string
}

export type GetDimensionResponse = GetDimensionError | GetDimensionSuccess
export type GetMonitoringResponse = GetMonitoringError | GetMonitoringSuccess
