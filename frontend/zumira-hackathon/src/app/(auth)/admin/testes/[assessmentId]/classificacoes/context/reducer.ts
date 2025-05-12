import { v4 } from "uuid";
import { ManageRatingAction, ManageRatingState } from "./types";
import { ManageRating } from "../definitions";

export function reducer(state: ManageRatingState, action: ManageRatingAction): ManageRatingState {
  switch (action.type) {
    case "ADD-RATING": {
      const empty: ManageRating = {
        key: v4(),
        name: "",
        notificationTypeId: "",
      };

      return { ratings: [...state.ratings, empty] };
    }

    case "REMOVE-RATING": {
      const ratings = state.ratings.filter((item) => item.key !== action.payload.ratingKey);
      return { ratings };
    }

    case "SET-NOTIFICATION-TYPE": {
      const rating = state.ratings.find((item) => item.key === action.payload.ratingKey);
      if (rating) {
        rating.notificationTypeId = action.payload.notificationTypeId;
      }

      return state;
    }

    case "CHANGE-NAME": {
      const rating = state.ratings.find((item) => item.key === action.payload.ratingKey);
      if (rating) {
        rating.name = action.payload.name;
      }

      return state;
    }
  }
}
