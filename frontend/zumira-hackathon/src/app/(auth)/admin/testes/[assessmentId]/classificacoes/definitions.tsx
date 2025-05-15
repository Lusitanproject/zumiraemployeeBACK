import { z } from "zod";

export interface AssessmentRating {
  id: string;
  risk: string;
  profile: string;
  color: string;
}

export type GetAssessmentRatings =
  | {
      status: "SUCCESS";
      data: {
        items: AssessmentRating[];
      };
    }
  | {
      status: "ERROR";
      message: string;
    };

export type UpdateAssessmentRatings =
  | {
      status: "SUCCESS";
      data: object;
    }
  | {
      status: "ERROR";
      message: string;
    };

export const ManageRatingSchema = z.object({
  key: z.string().uuid(),
  id: z.string().uuid().optional(),
  risk: z.string().nonempty(),
  profile: z.string().nonempty(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
});

export type ManageRating = z.infer<typeof ManageRatingSchema>;
