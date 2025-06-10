import { v4 } from "uuid";
import { ManageRatingAction, ManageRatingState } from "./types";
import { ManageRating } from "../definitions";

export function reducer(state: ManageRatingState, action: ManageRatingAction): ManageRatingState {
  switch (action.type) {
    case "ADD-RATING": {
      const empty: ManageRating = {
        key: v4(),
        risk: "",
        profile: "",
        color: "#AAAAAA",
      };

      return { ratings: [...state.ratings, empty] };
    }

    case "REMOVE-RATING": {
      const ratings = state.ratings.filter((item) => item.key !== action.payload.ratingKey);
      return { ratings };
    }

    case "CHANGE-RISK": {
      const rating = state.ratings.find((item) => item.key === action.payload.ratingKey);
      if (rating) {
        rating.risk = action.payload.risk;
      }

      return state;
    }

    case "CHANGE-PROFILE": {
      const rating = state.ratings.find((item) => item.key === action.payload.ratingKey);
      if (rating) {
        rating.profile = action.payload.profile;
      }

      return state;
    }

    case "CHANGE-COLOR": {
      const rating = state.ratings.find((item) => item.key === action.payload.ratingKey);
      if (rating) {
        rating.color = action.payload.color;
      }

      return state;
    }
  }
}
