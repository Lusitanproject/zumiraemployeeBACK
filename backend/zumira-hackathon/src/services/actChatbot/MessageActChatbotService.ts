import { MessageActChatbotRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";
import { generateOpenAiResponse, GenerateOpenAiResponseRequest } from "../../utils/generateOpenAiResponse";
import { PublicError } from "../../error";

class MessageActChatbotService {
  async execute({ content, actConversationId, userId }: MessageActChatbotRequest) {
    const conv = await prismaClient.actConversation.findFirst({
      where: {
        id: actConversationId,
        userId,
      },
      include: {
        actChatbot: true,
      },
    });

    if (!conv) throw new PublicError("Conversa não existe");

    await prismaClient.actConversationMessage.create({
      data: {
        actConversationId,
        role: "USER",
        content,
      },
    });

    const { actChatbot: bot } = conv;
    const messages = await prismaClient.actConversationMessage.findMany({
      where: {
        actConversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const historyAndInput = messages.map((m) => ({
      role: m.role === "SYSTEM" ? "assistant" : "user",
      content: m.content,
    })) as GenerateOpenAiResponseRequest["messages"];

    const response = await generateOpenAiResponse({
      instructions: bot.instructions,
      messages: historyAndInput,
    });

    await Promise.all([
      prismaClient.actConversationMessage.create({
        data: {
          actConversationId,
          role: "SYSTEM",
          content: response.output_text,
        },
      }),

      prismaClient.actConversation.update({
        where: {
          id: actConversationId,
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
