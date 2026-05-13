import { ChapterType, Prisma } from "@prisma/client";
import {
  CreateActChatbotRequest,
  ImportChatbaseChaptersRequest,
  UpdateActChatbotRequest,
  UpdateManyActChatbotsRequest,
} from "../../schemas/admin/act-chatbot";
import { PublicError } from "../../error";
import { ChatbaseApi } from "../../external/chatbase";
import prismaClient from "../../prisma";

class ActChatbotAdminService {
  private readonly actListSelect = {
    id: true,
    name: true,
    description: true,
    icon: true,
    index: true,
    trailId: true,
    createdAt: true,
  } satisfies Prisma.ActChatbotSelect;

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
        trailId: true,
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
      select: this.actListSelect,

      orderBy: {
        index: "asc",
      },
    });

    return { items: bots };
  }

  async findByTrail(trailId: string) {
    const bots = await prismaClient.actChatbot.findMany({
      select: this.actListSelect,

      where: {
        trailId,
      },

      orderBy: {
        index: "asc",
      },
    });

    return { items: bots };
  }

  async findByCompany(companyId: string) {
    const company = await prismaClient.company.findFirst({
      where: {
        id: companyId,
      },
      select: {
        trailId: true,
      },
    });

    if (!company) {
      throw new PublicError("Company not found");
    }

    return await this.findByTrail(company.trailId);
  }

  async create(data: CreateActChatbotRequest) {
    const existingBots = await prismaClient.actChatbot.findMany({ where: { trailId: data.trailId } });

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
          }),
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
        }),
      ),
    );
  }

  async importChatbaseChapters({ id, chatbaseChatbotId }: ImportChatbaseChaptersRequest & { id: string }) {
    const actChatbot = await prismaClient.actChatbot.findFirst({ where: { id } });

    if (!actChatbot) {
      throw new PublicError("Act chatbot does not exist");
    }

    const chatbase = new ChatbaseApi();

    const conversations = await chatbase.getConversationsFromChatbot({
      chatbotId: chatbaseChatbotId,
      filteredSources: "WhatsApp",
    });

    // Remove previously imported chapters/messages for these conversations and import again.
    const existingChapters = await prismaClient.actChapter.findMany({
      where: {
        actChatbotId: id,
        externalId: {
          in: conversations.map((c) => c.id),
        },
      },
      select: {
        id: true,
      },
    });

    const existingChapterIds = existingChapters.map((c) => c.id);
    if (existingChapterIds.length > 0) {
      await prismaClient.actChapterMessage.deleteMany({
        where: {
          actChapterId: {
            in: existingChapterIds,
          },
        },
      });

      await prismaClient.actChapter.deleteMany({
        where: {
          id: {
            in: existingChapterIds,
          },
        },
      });
    }

    // Normalize WhatsApp numbers so they match DB values.
    const normalizePhone = (p?: string | null) => (p ? p.replace(/\D/g, "").replace(/^55/, "") : "");

    const conversationUsersPhoneNumbers = conversations
      .map((c) => normalizePhone(c.form_submission?.phone))
      .filter(Boolean) as string[];

    const storedUsers = await prismaClient.user.findMany({
      where: {
        phoneNumber: {
          in: conversationUsersPhoneNumbers,
        },
      },
    });

    // Map normalized phone number -> user id for quick lookup.
    const phoneToUserId = new Map(storedUsers.map((u) => [normalizePhone(u.phoneNumber), u.id]));

    const chaptersFromConversations = await prismaClient.actChapter.createManyAndReturn({
      data: conversations
        .map((conv) => {
          const phone = normalizePhone(conv.form_submission?.phone);
          const userId = phoneToUserId.get(phone);

          if (!userId) {
            return null;
          }

          return {
            actChatbotId: id,
            userId,
            type: "REGULAR" as ChapterType,
            externalId: conv.id,
            createdAt: conv.created_at,
          };
        })
        .filter((v) => v !== null),
    });

    const createdMessages = await prismaClient.actChapterMessage.createMany({
      // Attach imported messages to their created chapter by external conversation id.
      data: chaptersFromConversations.flatMap((chapter) => {
        const conv = conversations.find((conv) => conv.id === chapter.externalId);

        if (!conv) {
          return [];
        }

        const messages = conv.messages.map((m) => ({
          actChapterId: chapter.id,
          content: m.content,
          role: m.role,
          createdAt: m.created_at,
        }));

        return messages;
      }),
    });

    const importedUserIds = new Set(chaptersFromConversations.map((chapter) => chapter.userId));
    const usersFound = storedUsers.filter((u) => importedUserIds.has(u.id));

    const conversationsWithoutUser = conversations
      .filter((conv) => {
        const phone = normalizePhone(conv.form_submission?.phone);
        return !phoneToUserId.has(phone);
      })
      .map((conv) => ({
        conversationId: conv.id,
        phone: normalizePhone(conv.form_submission?.phone) || null,
        name: conv.form_submission?.name || null,
      }));

    const usersFoundStructured = usersFound.map((u) => ({
      userId: u.id,
      name: u.name,
      phone: u.phoneNumber,
    }));

    return {
      chaptersCreated: chaptersFromConversations.length,
      messagesCreated: createdMessages.count,
      usersFound: usersFoundStructured,
      conversationsWithoutUser,
    };
  }
}

export { ActChatbotAdminService };
