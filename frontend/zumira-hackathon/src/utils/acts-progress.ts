"use server";

import { getActsData } from "@/api/acts";
import { ActsData } from "@/types/act";

export async function getActsProgress(data?: ActsData) {
  if (!data) data = await getActsData();
}
