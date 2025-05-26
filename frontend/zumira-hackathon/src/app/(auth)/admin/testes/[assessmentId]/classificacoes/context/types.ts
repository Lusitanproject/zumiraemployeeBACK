import { ManageRating } from "../definitions";

export type ManageRatingState = {
  ratings: ManageRating[];
};

type RemoveRating = {
  ratingKey: string;
};

type ChangeRisk = {
  ratingKey: string;
  risk: string;
};

type ChangeProfile = {
  ratingKey: string;
  profile: string;
};

type ChangeColor = {
  ratingKey: string;
  color: string;
};

export type ManageRatingAction =
  | { type: "ADD-RATING" }
  | { type: "REMOVE-RATING"; payload: RemoveRating }
  | { type: "CHANGE-RISK"; payload: ChangeRisk }
  | { type: "CHANGE-PROFILE"; payload: ChangeProfile }
  | { type: "CHANGE-COLOR"; payload: ChangeColor };
