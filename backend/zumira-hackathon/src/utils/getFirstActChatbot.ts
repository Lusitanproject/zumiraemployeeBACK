import { ActChatbot } from "@prisma/client";
import prismaClient from "../prisma";

export async function getFirstActChatbot(): Promise<ActChatbot | undefined> {
  const bots = await prismaClient.actChatbot.findMany();
  return bots.filter((b1) => !bots.some((b2) => b2.nextActChatbotId === b1.id))[0];
}
