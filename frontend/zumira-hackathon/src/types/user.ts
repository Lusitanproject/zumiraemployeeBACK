import { UserSchema } from "@/schemas";
import { z } from "zod";

export type User = z.infer<typeof UserSchema>;
