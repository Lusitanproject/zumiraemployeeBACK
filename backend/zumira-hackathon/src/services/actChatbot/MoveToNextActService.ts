import prismaClient from "../../prisma";
import { PublicError } from "../../error";

class MoveToNextActService {
  async execute(userId: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },

      include: {
        currentActChatbot: true,
      },
    });

    if (!user) throw new PublicError("Usuário não encontrado");
    if (!user.currentActChatbot) throw new PublicError("Usuário não está atribuído a nenhum ato");
    if (!user.currentActChatbot.nextActChatbotId) throw new PublicError("Não há mais atos restantes");

    const currentActMessages = await prismaClient.actConversationMessage.findMany({
      where: {
        actConversation: {
          userId,
          actChatbotId: user.currentActChatbot.id,
        },
      },
    });

    if (!currentActMessages.length) throw new PublicError("Usuário não iniciou o ato atual");

    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        currentActChatbotId: user.currentActChatbot.nextActChatbotId,
      },
    });

    const conversation = await prismaClient.actConversation.create({
      data: {
        userId,
        actChatbotId: user.currentActChatbot.nextActChatbotId,
      },

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

    return conversation;
  }
}

export { MoveToNextActService };
