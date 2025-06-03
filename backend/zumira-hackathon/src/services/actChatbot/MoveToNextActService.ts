import prismaClient from "../../prisma";

class MoveToNextActService {
  async execute(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },

      include: {
        currentActChatbot: true,
      },
    });

    if (!user) throw new Error("User not found");
    if (!user.currentActChatbot) throw new Error("User is not assigned to any acts");
    if (!user.currentActChatbot.nextActChatbotId) throw new Error("No more acts remaining");

    const currentActMessages = await prismaClient.actConversationMessage.findMany({
      where: {
        actConversation: {
          userId,
          actChatbotId: user.currentActChatbot.id,
        },
      },
    });

    if (!currentActMessages.length) throw new Error("User has not started the current act");

    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        currentActChatbotId: user.currentActChatbot.nextActChatbotId,
      },
    });

    const conversation = await prismaClient.actConversation.create({
      data: {
        userId,
        actChatbotId: user.currentActChatbot.nextActChatbotId,
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

export { MoveToNextActService };
