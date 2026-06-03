import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class TrailService {
  private getProgress(
    bots: { id: string; index: number }[],
    chapters: { actChatbotId: string; compilation: string | null }[],
  ): number {
    if (!bots.length) return 0;
    const sorted = [...bots].sort((a, b) => a.index - b.index);
    let completed = 0;
    for (const bot of sorted) {
      if (chapters.find((c) => c.actChatbotId === bot.id && !!c.compilation)) {
        completed += 1;
      } else {
        break;
      }
    }
    return completed / sorted.length;
  }

  async ensureProgress(userId: string, trailId: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { company: { select: { trailId: true } } },
    });

    if (user?.company?.trailId !== trailId) {
      throw new PublicError("Usuário não tem acesso a esta trilha");
    }

    const existing = await prismaClient.userTrailProgress.findUnique({
      where: { userId_trailId: { userId, trailId } },
    });
    if (existing) return existing;

    const first = await prismaClient.trailActChatbot.findFirst({
      where: { trailId },
      orderBy: { index: "asc" },
    });
    if (!first) return null;

    return prismaClient.userTrailProgress.upsert({
      where: { userId_trailId: { userId, trailId } },
      create: { userId, trailId, currentActChatbotId: first.actChatbotId, currentIndex: first.index },
      update: {},
    });
  }

  async list(userId: string, trailId: string) {
    const progress = await this.ensureProgress(userId, trailId);
    if (!progress) return { chatbots: [], chapters: [], progress: 0 };

    const [rows, chapters] = await Promise.all([
      prismaClient.trailActChatbot.findMany({
        where: { trailId },
        orderBy: { index: "asc" },
        select: {
          index: true,
          actChatbot: { select: { id: true, name: true, description: true, icon: true } },
        },
      }),
      prismaClient.actChapter.findMany({
        where: {
          userId,
          type: "REGULAR",
          actChatbot: { trails: { some: { trailId } } },
        },
        select: {
          id: true,
          title: true,
          actChatbotId: true,
          compilation: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const chatbots = rows.map((r) => ({ ...r.actChatbot, index: r.index }));
    const actProgress = this.getProgress(chatbots, chapters);

    const currAct =
      chatbots.find((b) => b.id === progress.currentActChatbotId) ??
      chatbots[Math.min(progress.currentIndex, Math.max(0, chatbots.length - 1))];

    const processedChatbots = chatbots.map((bot) => ({
      ...bot,
      locked: currAct ? bot.index > currAct.index : false,
      current: bot.id === currAct?.id,
    }));

    const processedChapters = chapters.map(({ compilation: _, ...rest }) => rest);

    return { chatbots: processedChatbots, chapters: processedChapters, progress: actProgress };
  }

  async getFullStory(userId: string, trailId: string) {
    const chapters = await prismaClient.actChapter.findMany({
      where: {
        userId,
        type: "REGULAR",
        compilation: { not: null },
        actChatbot: { trails: { some: { trailId } } },
      },
      select: {
        id: true,
        title: true,
        compilation: true,
        createdAt: true,
        updatedAt: true,
        actChatbot: {
          select: {
            name: true,
            trails: { where: { trailId }, select: { index: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const result = chapters.map((c) => ({
      ...c,
      actChatbot: {
        name: c.actChatbot.name,
        index: c.actChatbot.trails[0]?.index ?? null,
      },
    }));

    return { chapters: result };
  }

  async moveToNextAct(userId: string, trailId: string): Promise<{ currActChatbotId: string }> {
    const progress = await prismaClient.userTrailProgress.findUnique({
      where: { userId_trailId: { userId, trailId } },
      select: { currentActChatbotId: true, currentIndex: true },
    });

    if (!progress?.currentActChatbotId) throw new PublicError("Usuário não está atribuído a nenhum ato");
    const currentActChatbotId = progress.currentActChatbotId;

    const currentActMessages = await prismaClient.actChapterMessage.findMany({
      where: { actChapter: { userId, actChatbotId: currentActChatbotId } },
    });
    if (!currentActMessages.length) throw new PublicError("Usuário não iniciou o ato atual");

    const nextIndex = progress.currentIndex + 1;
    const nextAssoc = await prismaClient.trailActChatbot.findFirst({
      where: { trailId, index: nextIndex },
      select: { actChatbotId: true },
    });

    if (!nextAssoc) return { currActChatbotId: currentActChatbotId };

    await prismaClient.userTrailProgress.update({
      where: { userId_trailId: { userId, trailId } },
      data: { currentActChatbotId: nextAssoc.actChatbotId, currentIndex: nextIndex },
    });

    return { currActChatbotId: nextAssoc.actChatbotId };
  }
}

export { TrailService };
