import prismaClient from "../../prisma";

class GetActsDataService {
  async execute(userId: string) {
    const [user, chatbots, chapters] = await Promise.all([
      await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      }),

      await prismaClient.actChatbot.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          index: true,
        },
        orderBy: {
          index: "asc",
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
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    if (!user) throw new Error("Usuário não encontrado");

    let currAct = chatbots.find((bot) => bot.id === user.currentActChatbotId);
    if (!currAct) {
      if (!chatbots.length) return { chatbots: [], chapters: [] };

      currAct = chatbots[0];
      await prismaClient.user.update({ where: { id: userId }, data: { currentActChatbotId: currAct?.id } });
    }

    const processedChatbots = chatbots.map((bot) => ({
      ...bot,
      locked: bot.index > currAct.index,
      current: bot.id === currAct.id,
    }));

    return { chatbots: processedChatbots, chapters };
  }
}

export { GetActsDataService };
