import { z } from "zod";
import { PsychologicalDimensionSchema } from "@/schemas";

export type Dimension = z.infer<typeof PsychologicalDimensionSchema>;
