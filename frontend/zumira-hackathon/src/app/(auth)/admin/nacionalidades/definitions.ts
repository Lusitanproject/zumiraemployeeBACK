import { Nationality } from "@/types/nationality";

export type GetNationalitiesResponse = {
  status: "SUCCESS";
  data: { items: Nationality[] };
};
