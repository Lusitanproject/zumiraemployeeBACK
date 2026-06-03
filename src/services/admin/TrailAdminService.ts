import prismaClient from "../../prisma";
import { CreateTrailRequest, SetTrailActsRequest, UpdateTrailRequest } from "../../schemas/admin/trail";

class TrailAdminService {
  async find(id: string) {
    const trail = await prismaClient.trail.findFirst({ where: { id } });
    return trail;
  }

  async findAll() {
    const trails = await prismaClient.trail.findMany();
    return { items: trails };
  }

  async create(data: CreateTrailRequest) {
    const trail = await prismaClient.trail.create({ data });
    return trail;
  }

  async update({ id, ...data }: UpdateTrailRequest) {
    const trail = await prismaClient.trail.update({ where: { id }, data });
    return trail;
  }

  async setActs({ trailId, acts }: SetTrailActsRequest) {
    const ordered = [...acts]
      .sort((a, b) => a.index - b.index)
      .map((a, i) => ({ actChatbotId: a.actChatbotId, index: i }));

    // Trilha esvaziada: remove junction e todos os progressos (recriados lazily ao primeiro acesso)
    if (ordered.length === 0) {
      await prismaClient.$transaction([
        prismaClient.trailActChatbot.deleteMany({ where: { trailId } }),
        prismaClient.userTrailProgress.deleteMany({ where: { trailId } }),
      ]);
      return;
    }

    const newIndexById = new Map(ordered.map((a) => [a.actChatbotId, a.index]));
    const maxIndex = ordered.length - 1;

    // Lê os progressos antes da transação para não segurá-la aberta durante o loop
    const progresses = await prismaClient.userTrailProgress.findMany({
      where: { trailId, currentActChatbotId: { not: null } },
      select: { userId: true, currentActChatbotId: true, currentIndex: true },
    });

    // Substituição atômica da junction (forma de array — rápida, sem timeout)
    await prismaClient.$transaction([
      prismaClient.trailActChatbot.deleteMany({ where: { trailId } }),
      prismaClient.trailActChatbot.createMany({ data: ordered.map((a) => ({ trailId, ...a })) }),
    ]);

    // Recalcula progressos em paralelo, fora da transação
    await Promise.all(
      progresses.map((p) => {
        const newIdx = newIndexById.get(p.currentActChatbotId!);

        if (newIdx !== undefined) {
          if (newIdx === p.currentIndex) return;
          return prismaClient.userTrailProgress.update({
            where: { userId_trailId: { userId: p.userId, trailId } },
            data: { currentIndex: newIdx },
          });
        }

        // Ato removido (órfão): clamp para o próximo disponível ou o último
        const targetIdx = Math.min(p.currentIndex, maxIndex);
        const target = ordered[targetIdx];
        return prismaClient.userTrailProgress.update({
          where: { userId_trailId: { userId: p.userId, trailId } },
          data: { currentActChatbotId: target.actChatbotId, currentIndex: targetIdx },
        });
      }),
    );
  }
}

export { TrailAdminService };
