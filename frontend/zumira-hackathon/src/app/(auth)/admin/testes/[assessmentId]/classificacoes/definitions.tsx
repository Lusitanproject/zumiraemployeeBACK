import { z } from "zod";

export interface NotificationType {
  id: string;
  name: string;
  priority: number;
  color: string;
}

export interface AssessmentRating {
  id: string;
  name: string;
  notificationType: NotificationType;
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

export type GetNotificationTypes =
  | {
      status: "SUCCESS";
      data: {
        items: NotificationType[];
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
  name: z.string(),
  notificationTypeId: z.string().cuid(),
});

export type ManageRating = z.infer<typeof ManageRatingSchema>;
