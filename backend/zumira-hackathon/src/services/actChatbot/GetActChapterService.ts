import { GetActChapterRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";

class GetActChapterService {
  async execute({ userId, actChapterId }: GetActChapterRequest) {
    const [chapter, messages] = await Promise.all([
      prismaClient.actChapter.findFirst({
        where: { id: actChapterId },
        select: {
          id: true,
          title: true,
          compilation: true,
          actChatbot: {
            select: {
              id: true,
              description: true,
              icon: true,
              name: true,
            },
          },
        },
      }),

      prismaClient.actChapterMessage.findMany({
        where: {
          actChapterId,
          actChapter: {
            userId,
          },
        },

        select: {
          content: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    if (!chapter) throw new Error("Chapter not found");

    return { ...chapter, messages };
  }
}

export { GetActChapterService };
