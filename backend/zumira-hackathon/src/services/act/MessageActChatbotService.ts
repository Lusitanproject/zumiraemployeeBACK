import { MessageActChatbotRequest } from "../../definitions/actChatbot";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { generateOpenAiResponse, GenerateOpenAiResponseRequest } from "../../utils/generateOpenAiResponse";

class MessageActChatbotService {
  async execute({ content, actChapterId, userId }: MessageActChatbotRequest) {
    const conv = await prismaClient.actChapter.findFirst({
      where: {
        id: actChapterId,
        userId,
      },
      include: {
        actChatbot: true,
        user: true,
      },
    });

    if (!conv) throw new PublicError("Conversa não existe");

    await prismaClient.actChapterMessage.create({
      data: {
        actChapterId,
        role: "user",
        content,
      },
    });

    const { actChatbot: bot } = conv;
    const messages = await prismaClient.actChapterMessage.findMany({
      where: {
        actChapterId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const historyAndInput = messages.map((m) => ({
      role: m.role,
      content: m.content,
    })) as GenerateOpenAiResponseRequest["messages"];

    const response = await generateOpenAiResponse({
      instructions: bot.messageInstructions + `\nO nome do usuário é: ${conv.user.name.split(" ")[0]}`,
      messages: historyAndInput,
    });

    await Promise.all([
      prismaClient.actChapterMessage.create({
        data: {
          actChapterId,
          role: "assistant",
          content: response.output_text,
        },
      }),

      prismaClient.actChapter.update({
        where: {
          id: actChapterId,
        },
        data: {
          updatedAt: new Date(),
        },
      }),
    ]);

    return response.output_text;
  }
}

export { MessageActChatbotService };
