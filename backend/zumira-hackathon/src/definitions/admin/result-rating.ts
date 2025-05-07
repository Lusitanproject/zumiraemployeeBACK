import { z } from "zod";

export const CreateResultRatingSchema = z.object({
  name: z.string().nonempty(),
});

export const EditResultRatingSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
});
