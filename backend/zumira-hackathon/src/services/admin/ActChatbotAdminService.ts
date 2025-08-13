import {
  CreateActChatbotRequest,
  UpdateActChatbotRequest,
  UpdateManyActChatbotsRequest,
} from "../../definitions/admin/act-chatbot";
import prismaClient from "../../prisma";

class ActChatbotAdminService {
  async find(id: string) {
    const bot = await prismaClient.actChatbot.findFirst({
      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        initialMessage: true,
        messageInstructions: true,
        compilationInstructions: true,
        index: true,
        actChapters: {
          where: {
            type: "ADMIN_TEST",
          },
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return bot;
  }

  async findAll() {
    const bots = await prismaClient.actChatbot.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        index: true,
      },

      orderBy: {
        index: "asc",
      },
    });

    return { items: bots };
  }

  async create(data: CreateActChatbotRequest) {
    const existingBots = await prismaClient.actChatbot.findMany();

    const bot = await prismaClient.actChatbot.create({
      data: {
        ...data,
        index: existingBots.length,
      },
    });

    // Garantir que todo usuário sem ato é atualizado quando o primeiro bot é criado
    const first = existingBots.find((b) => b.index === 0);
    if (first) {
      const noActUsers = await prismaClient.user.findMany({
        where: {
          currentActChatbotId: null,
        },
      });

      await Promise.all([
        prismaClient.user.updateMany({
          where: {
            id: {
              in: noActUsers.map((u) => u.id),
            },
          },
          data: {
            currentActChatbotId: first.id,
          },
        }),

        ...noActUsers.map((user) =>
          prismaClient.actChapter.create({
            data: {
              actChatbotId: first.id,
              userId: user.id,
              type: "REGULAR",
            },
          })
        ),
      ]);
    }

    return bot;
  }

  async update({ id, ...data }: UpdateActChatbotRequest) {
    const bot = await prismaClient.actChatbot.update({
      where: { id },
      data,
    });
    return bot;
  }

  async updateMany({ chatbots }: UpdateManyActChatbotsRequest) {
    await Promise.all(
      chatbots.map((bot) =>
        prismaClient.actChatbot.update({
          where: {
            id: bot.id,
          },
          data: { ...bot },
        })
      )
    );
  }
}

export { ActChatbotAdminService };
