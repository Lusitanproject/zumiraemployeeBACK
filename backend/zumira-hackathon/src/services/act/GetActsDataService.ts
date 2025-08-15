import prismaClient from "../../prisma";

function getProgress(
  bots: {
    id: string;
    name: string;
    description: string;
    icon: string;
    index: number;
  }[],
  chapters: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    compilation: string | null;
    actChatbotId: string;
  }[]
) {
  const _bots = [...bots].sort((a, b) => a.index - b.index);

  let completedActs = 0;
  for (const bot of _bots) {
    if (chapters.find((chapter) => chapter.actChatbotId === bot.id && !!chapter.compilation)) {
      completedActs += 1;
    } else {
      break;
    }
  }

  return completedActs / _bots.length;
}
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
          compilation: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    const progress = getProgress(chatbots, chapters);

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

    const processedChapters = chapters.map((chapter) => {
      const { compilation: _, ...formatted } = chapter;
      return formatted;
    });

    return { chatbots: processedChatbots, chapters: processedChapters, progress };
  }
}

export { GetActsDataService };
