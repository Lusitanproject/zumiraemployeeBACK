import {
  CompileActChapterRequest,
  CreateActChapterRequest,
  GetActChapterRequest,
  MessageActChatbotRequest,
  UpdateActChapterRequest,
} from "../../schemas/actChatbot";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { OpenAiApi, GenerateOpenAiResponseRequest } from "../../external/openai";

function getProgress(
  bots: { id: string; name: string; description: string; icon: string; index: number }[],
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

class ActService {
  async compileChapter({ actChapterId, userId }: CompileActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({
      where: { userId, id: actChapterId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        actChatbot: true,
      },
    });
    if (!chapter) throw new Error("Chapter not found");

    const messages = chapter.messages.map((m) => ({
      content: m.content,
      role: "user",
    })) as GenerateOpenAiResponseRequest["messages"];

    const openai = new OpenAiApi();
    const response = await openai.generateResponse({
      messages,
      instructions: chapter.actChatbot.compilationInstructions,
    });

    const data = await prismaClient.actChapter.update({
      where: { id: actChapterId },
      data: { compilation: response.output_text },
    });

    return data;
  }

  async createChapter(data: CreateActChapterRequest) {
    await prismaClient.actChapter.deleteMany({
      where: { userId: data.userId, messages: { none: {} } },
    });

    const chapter = await prismaClient.actChapter.create({
      data,
      select: {
        id: true,
        actChatbot: {
          select: { name: true, icon: true, description: true },
        },
      },
    });

    return chapter;
  }

  async getChapter({ userId, actChapterId }: GetActChapterRequest) {
    const [chapter, messages] = await Promise.all([
      prismaClient.actChapter.findFirst({
        where: { id: actChapterId },
        select: {
          id: true,
          title: true,
          compilation: true,
          actChatbot: {
            select: { id: true, description: true, icon: true, name: true, initialMessage: true },
          },
        },
      }),
      prismaClient.actChapterMessage.findMany({
        where: { actChapterId, actChapter: { userId } },
        select: { content: true, role: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    if (!chapter) throw new Error("Chapter not found");

    return { ...chapter, messages };
  }

  async list(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) throw new PublicError("Usuário não encontrado");

    const [chatbots, chapters] = await Promise.all([
      prismaClient.actChatbot.findMany({
        where: { trailId: user.company?.trailId },
        select: { id: true, name: true, description: true, icon: true, index: true },
        orderBy: { index: "asc" },
      }),
      prismaClient.actChapter.findMany({
        where: {
          userId,
          type: "REGULAR",
          actChatbot: { trailId: user.company?.trailId },
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

    const progress = getProgress(chatbots, chapters);

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

  async getFullStory(userId: string) {
    const user = await prismaClient.user.findFirst({ where: { id: userId }, select: { company: true } });

    if (!user) throw new PublicError("Usuário não encontrado");

    const chapters = await prismaClient.actChapter.findMany({
      where: {
        userId,
        type: "REGULAR",
        compilation: { not: null },
        actChatbot: { trailId: user.company?.trailId },
      },
      select: {
        id: true,
        title: true,
        compilation: true,
        createdAt: true,
        updatedAt: true,
        actChatbot: { select: { index: true, name: true } },
      },
    });

    return { chapters };
  }

  async message({ content, actChapterId, userId }: MessageActChatbotRequest) {
    const conv = await prismaClient.actChapter.findFirst({
      where: { id: actChapterId, userId },
      include: { actChatbot: true, user: true },
    });

    if (!conv) throw new PublicError("Conversa não existe");

    await prismaClient.actChapterMessage.create({
      data: { actChapterId, role: "user", content },
    });

    const { actChatbot: bot } = conv;
    const messages = await prismaClient.actChapterMessage.findMany({
      where: { actChapterId },
      orderBy: { createdAt: "asc" },
    });

    const historyAndInput = messages.map((m) => ({
      role: m.role,
      content: m.content,
    })) as GenerateOpenAiResponseRequest["messages"];

    if (conv.actChatbot.initialMessage)
      historyAndInput.unshift({ role: "assistant", content: conv.actChatbot.initialMessage });

    const openai = new OpenAiApi();
    const response = await openai.generateResponse({
      instructions: bot.messageInstructions + `\nO nome do usuário é: ${conv.user.name.split(" ")[0]}`,
      messages: historyAndInput,
    });

    await Promise.all([
      prismaClient.actChapterMessage.create({
        data: { actChapterId, role: "assistant", content: response.output_text },
      }),
      prismaClient.actChapter.update({
        where: { id: actChapterId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return response.output_text;
  }

  async moveToNext(userId: string): Promise<{ currActChatbotId: string }> {
    const user = await prismaClient.user.findFirst({
      where: { id: userId },
      include: { currentActChatbot: true, company: true },
    });

    if (!user) throw new PublicError("Usuário não encontrado");
    if (!user.currentActChatbot) throw new PublicError("Usuário não está atribuído a nenhum ato");

    const trailId = user.company?.trailId;

    const currentActMessages = await prismaClient.actChapterMessage.findMany({
      where: { actChapter: { userId, actChatbotId: user.currentActChatbot.id } },
    });

    if (!currentActMessages.length) throw new PublicError("Usuário não iniciou o ato atual");

    const nextAct = await prismaClient.actChatbot.findFirst({
      where: { trailId, index: user.currentActChatbot.index + 1 },
    });

    if (!nextAct) return { currActChatbotId: user.currentActChatbot.id };

    await prismaClient.user.update({
      where: { id: userId },
      data: { currentActChatbotId: nextAct.id },
    });

    return { currActChatbotId: nextAct.id };
  }

  async updateChapter({ userId, actChapterId, compilation, title }: UpdateActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({ where: { id: actChapterId, userId } });

    if (!chapter) throw new Error("Chapter not found");

    const result = await prismaClient.actChapter.update({
      where: { id: actChapterId, userId },
      data: { compilation, title },
    });

    return result;
  }
}

export { ActService };
