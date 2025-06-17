import { CompileActChapterRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";
import { generateOpenAiResponse } from "../../utils/generateOpenAiResponse";

class CompileActChapterService {
  async execute({ actChapterId, userId }: CompileActChapterRequest) {
    const messages = await prismaClient.actChapterMessage.findMany({
      where: {
        actChapter: {
          userId,
        },
        actChapterId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!messages.length) throw new Error("No messages found to compile");

    const input = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    const response = await generateOpenAiResponse({
      messages: [{ content: input, role: "user" }],
      instructions: "Escreva um capítulo de livro com base nessa conversa",
    });

    const data = await prismaClient.actChapterCompilation.create({
      data: {
        content: response.output_text,
        actChapterId,
      },
    });

    return data;
  }
}

export { CompileActChapterService };
