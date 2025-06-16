import prismaClient from "../../prisma";

class GetActsDataService {
  async execute(userId: string) {
    const [chatbots, conversations] = await Promise.all([
      await prismaClient.actChatbot.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          nextActChatbotId: true,
        },
      }),

      prismaClient.actConversation.findMany({
        where: {
          userId,
          type: "REGULAR",
        },
        select: {
          id: true,
          title: true,
          actChatbotId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return { chatbots, conversations };
  }
}

export { GetActsDataService };
