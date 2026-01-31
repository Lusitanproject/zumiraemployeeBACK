import { z } from "zod";

export const RequestParamsIdUUID = z.object({
  id: z.string().uuid(),
});

export const RequestParamsIdCUID = z.object({
  id: z.string().cuid(),
});
