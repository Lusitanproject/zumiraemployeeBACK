import { CompileActChapterRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";
import { generateOpenAiResponse } from "../../utils/generateOpenAiResponse";

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

    const input = chapter.messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    const response = await generateOpenAiResponse({
      messages: [{ content: input, role: "user" }],
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
