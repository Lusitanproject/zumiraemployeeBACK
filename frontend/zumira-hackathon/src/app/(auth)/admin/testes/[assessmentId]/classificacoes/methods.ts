import { AssessmentRating, ManageRating } from "./definitions";

export function translateRatings(ratings: AssessmentRating[]): ManageRating[] {
  const translated: ManageRating[] = ratings.map((r) => ({
    key: r.id,
    id: r.id,
    risk: r.risk,
    profile: r.profile,
    color: r.color,
  }));

  return translated;
}
