import { CreateActConversationRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";

class CreateActConversationService {
  async execute({ actChatbotId, userId }: CreateActConversationRequest) {
    const conversation = await prismaClient.actConversation.create({
      data: {
        userId,
        actChatbotId,
      },

      select: {
        id: true,
        actChatbot: {
          select: {
            name: true,
            icon: true,
            description: true,
          },
        },
      },
    });

    return conversation;
  }
}

export { CreateActConversationService };
