import { UpdateActChapterCompilationRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";

class UpdateActChapterCompilationService {
  async execute({ userId, actChapterId, content }: UpdateActChapterCompilationRequest) {
    const chapter = await prismaClient.actChapter.findFirst({
      where: {
        id: actChapterId,
        userId,
      },
    });

    if (!chapter) throw new Error("Chapter not found");

    const result = await prismaClient.actChapterCompilation.create({
      data: {
        actChapterId,
        content,
      },
    });

    return result;
  }
}

export { UpdateActChapterCompilationService };
