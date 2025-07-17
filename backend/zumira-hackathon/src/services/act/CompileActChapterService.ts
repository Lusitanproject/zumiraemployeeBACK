import { CompileActChapterRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";
import { generateOpenAiResponse, GenerateOpenAiResponseRequest } from "../../utils/generateOpenAiResponse";

class CompileActChapterService {
  async execute({ actChapterId, userId }: CompileActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({
      where: {
        userId,
        id: actChapterId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        actChatbot: true,
      },
    });
    if (!chapter) throw new Error("Chapter not found");

    const messages = chapter.messages.map((m) => ({
      content: m.content,
      role: "user",
    })) as GenerateOpenAiResponseRequest["messages"];

    const response = await generateOpenAiResponse({
      messages,
      instructions: chapter.actChatbot.compilationInstructions,
    });

    const data = await prismaClient.actChapter.update({
      where: {
        id: actChapterId,
      },
      data: {
        compilation: response.output_text,
      },
    });

    return data;
  }
}

export { CompileActChapterService };
