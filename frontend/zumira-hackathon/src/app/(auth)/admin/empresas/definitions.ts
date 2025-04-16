import { z } from "zod";
import { CompanySchema } from "@/schemas";

export type Company = z.infer<typeof CompanySchema>;
