import { PublicError } from "../../error";
import prismaClient from "../../prisma";

class MoveToNextActService {
  async execute(userId: string): Promise<{ currActChatbotId: string }> {
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

    const currentActMessages = await prismaClient.actChapterMessage.findMany({
      where: {
        actChapter: {
          userId,
          actChatbotId: user.currentActChatbot.id,
        },
      },
    });

    if (!currentActMessages.length) throw new PublicError("Usuário não iniciou o ato atual");

    const nextAct = await prismaClient.actChatbot.findFirst({
      where: {
        index: user.currentActChatbot.index + 1,
      },
    });

    if (!nextAct) return { currActChatbotId: user.currentActChatbot.id };

    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        currentActChatbotId: nextAct.id,
      },
    });

    return { currActChatbotId: nextAct.id };
  }
}

export { MoveToNextActService };
