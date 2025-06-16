import { CreateActConversationRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";

class CreateActConversationService {
  async execute(data: CreateActConversationRequest) {
    await prismaClient.actConversation.deleteMany({
      where: {
        userId: data.userId,
        messages: {
          none: {},
        },
      },
    });

    const conversation = await prismaClient.actConversation.create({
      data,
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
