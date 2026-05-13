import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class GetFullStoryService {
  async execute(userId: string) {
    const user = await prismaClient.user.findFirst({ where: { id: userId }, select: { company: true } });

    if (!user) throw new PublicError("Usuário não encontrado");

    const chapters = await prismaClient.actChapter.findMany({
      where: {
        userId,
        type: "REGULAR",
        compilation: {
          not: null,
        },
        actChatbot: {
          trailId: user.company?.trailId,
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
