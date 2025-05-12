import { ManageRating } from "../definitions";

export type ManageRatingState = {
  ratings: ManageRating[];
};

type SetNotificationType = {
  ratingKey: string;
  notificationTypeId: string;
};

type RemoveRating = {
  ratingKey: string;
};

type ChangeName = {
  ratingKey: string;
  name: string;
};

export type ManageRatingAction =
  | { type: "ADD-RATING" }
  | { type: "REMOVE-RATING"; payload: RemoveRating }
  | { type: "SET-NOTIFICATION-TYPE"; payload: SetNotificationType }
  | { type: "CHANGE-NAME"; payload: ChangeName };
