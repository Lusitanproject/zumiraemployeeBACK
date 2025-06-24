import prismaClient from "../../prisma";

class GetActsDataService {
  async execute(userId: string) {
    const [chatbots, chapters] = await Promise.all([
      await prismaClient.actChatbot.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          nextActChatbotId: true,
        },
      }),

      prismaClient.actChapter.findMany({
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

    return { chatbots, chapters };
  }
}

export { GetActsDataService };
