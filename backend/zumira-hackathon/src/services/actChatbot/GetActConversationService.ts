import { GetActConversationRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";

class GetActConversationService {
  async execute({ userId, actConversationId }: GetActConversationRequest) {
    const [conversation, messages] = await Promise.all([
      prismaClient.actConversation.findFirst({
        where: { id: actConversationId },
        select: {
          id: true,
          title: true,
          actChatbotId: true,
        },
      }),

      prismaClient.actConversationMessage.findMany({
        where: {
          actConversationId,
          actConversation: {
            userId,
          },
        },

        select: {
          content: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    return { conversation, messages };
  }
}

export { GetActConversationService };
