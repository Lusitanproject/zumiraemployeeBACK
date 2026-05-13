import { UpdateActChapterRequest } from "../../schemas/actChatbot";
import prismaClient from "../../prisma";

class UpdateActChapterService {
  async execute({ userId, actChapterId, compilation, title }: UpdateActChapterRequest) {
    const chapter = await prismaClient.actChapter.findFirst({
      where: {
        id: actChapterId,
        userId,
      },
    });

    if (!chapter) throw new Error("Chapter not found");

    const result = await prismaClient.actChapter.update({
      where: {
        id: actChapterId,
        userId,
      },
      data: {
        compilation,
        title,
      },
    });

    return result;
  }
}

export { UpdateActChapterService };
