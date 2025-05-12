import { AssessmentRating, ManageRating } from "./definitions";

export function translateRatings(ratings: AssessmentRating[]): ManageRating[] {
  const translated: ManageRating[] = ratings.map((r) => ({
    key: r.id,
    id: r.id,
    name: r.name,
    notificationTypeId: r.notificationType.id,
  }));

  return translated;
}
