import prismaClient from "../../prisma";

class GetFullStoryService {
  async execute(userId: string) {
    const chapters = await prismaClient.actChapter.findMany({
      where: {
        userId,
        type: "REGULAR",
        compilation: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        compilation: true,
        createdAt: true,
        updatedAt: true,
        actChatbot: {
          select: {
            index: true,
            name: true,
          },
        },
      },
    });

    return { chapters };
  }
}

export { GetFullStoryService };
