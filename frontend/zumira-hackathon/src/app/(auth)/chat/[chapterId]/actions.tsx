"use server";

import { redirect } from "next/navigation";

import { getActsData, moveToNextAct } from "@/api/acts";

export async function moveToNext(currentActId: string) {
  const actsData = await getActsData();

  const currAct = actsData.chatbots.find((bot) => bot.id === currentActId);
  const nextAct = actsData.chatbots.find((bot) => bot.index === (currAct ? currAct.index + 1 : -1));

  let response;
  if (nextAct?.locked) {
    response = await moveToNextAct();
  }

  redirect(`/chat/novo?default=${nextAct?.id ?? response ?? currentActId}`);
}
