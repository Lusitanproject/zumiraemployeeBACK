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
          actChatbot: {
            select: {
              id: true,
              description: true,
              icon: true,
              name: true,
            },
          },
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

    if (!conversation) throw new Error("Conversation not found");

    return { ...conversation, messages };
  }
}

export { GetActConversationService };
