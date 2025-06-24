import { CreateActChapterRequest } from "../../definitions/actChatbot";
import prismaClient from "../../prisma";

class CreateActChapterService {
  async execute(data: CreateActChapterRequest) {
    await prismaClient.actChapter.deleteMany({
      where: {
        userId: data.userId,
        messages: {
          none: {},
        },
      },
    });

    const chapter = await prismaClient.actChapter.create({
      data,
      select: {
        id: true,
        actChatbot: {
          select: {
            name: true,
            icon: true,
            description: true,
          },
        },
      },
    });

    return chapter;
  }
}

export { CreateActChapterService };
