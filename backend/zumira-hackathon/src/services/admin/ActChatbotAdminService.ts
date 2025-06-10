import { Prisma } from "@prisma/client";

import {
  CreateActChatbotRequest,
  ReorderActChatbotsRequest,
  UpdateActChatbotRequest,
} from "../../definitions/admin/act-chatbot";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";
import { getFirstActChatbot } from "../../utils/getFirstActChatbot";

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
        instructions: true,
        nextActChatbotId: true,
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
        nextActChatbotId: true,
      },
    });

    const items = [];
    let aux = bots.find((b) => !b.nextActChatbotId);
    while (aux) {
      items.unshift(aux);
      aux = bots.find((b) => b.nextActChatbotId === aux?.id);
    }

    return { items };
  }

  async create(data: CreateActChatbotRequest) {
    const bot = await prismaClient.actChatbot.create({
      data: {
        ...data,
      },
    });

    await prismaClient.actChatbot.updateMany({
      where: {
        nextActChatbot: null,
        id: {
          not: bot.id,
        },
      },
      data: {
        nextActChatbotId: bot.id,
      },
    });

    // Garantir que todo usuário sem ato é atualizado quando o primeiro bot é criado
    const first = await getFirstActChatbot();
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
          prismaClient.actConversation.create({
            data: {
              actChatbotId: first.id,
              userId: user.id,
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

  async reorder({ chatbots }: ReorderActChatbotsRequest) {
    const bots = await prismaClient.actChatbot.findMany();

    if (chatbots.length !== bots.length) throw new PublicError("Todos os chatbots devem ser enviados");

    const botsMap = new Map<string | null, string>();
    chatbots.forEach((cb) => botsMap.set(cb.nextActChatbotId, cb.id));

    // O loop tenta caminhar por todos os ids seguindo a estrutura passada na requisição para verificar se todos estão contectados linearmente
    let count = -1;
    let aux: string | null | undefined = null;
    do {
      count += 1;
      aux = botsMap.get(aux);
    } while (aux !== undefined);

    if (count < chatbots.length) throw new PublicError("Os chatbots devem estar todos conectados continuamente");

    const queryString = Prisma.sql`
      UPDATE act_chatbots
      SET next_act_chatbot_id = CASE id
        ${Prisma.join(
          chatbots.map(
            (cb) => Prisma.sql`
              WHEN ${cb.id} THEN ${cb.nextActChatbotId}
            `
          ),
          "\n"
        )}
      END
      WHERE id IN (${Prisma.join(
        chatbots.map((cb) => Prisma.sql`${cb.id}`),
        ", "
      )})
    `;

    await prismaClient.$executeRaw(queryString);
  }
}

export { ActChatbotAdminService };
