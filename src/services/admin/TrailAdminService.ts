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

  // Trilha esvaziada: remove junction e todos os progressos (recriados lazily ao primeiro acesso)
  async syncTrailActs(trailId: string, ordered: { actChatbotId: string; index: number }[]) {
    if (ordered.length === 0) {
      await prismaClient.$transaction([
        prismaClient.trailActChatbot.deleteMany({ where: { trailId } }),
        prismaClient.userTrailProgress.deleteMany({ where: { trailId } }),
      ]);
      return;
    }

    const newIndexById = new Map(ordered.map((a) => [a.actChatbotId, a.index]));
    const maxIndex = ordered.length - 1;

    const progresses = await prismaClient.userTrailProgress.findMany({
      where: { trailId, currentActChatbotId: { not: null } },
      select: { userId: true, currentActChatbotId: true, currentIndex: true },
    });

    await prismaClient.$transaction([
      prismaClient.trailActChatbot.deleteMany({ where: { trailId } }),
      prismaClient.trailActChatbot.createMany({ data: ordered.map((a) => ({ trailId, ...a })) }),
    ]);

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

  async removeActFromTrails(actChatbotId: string) {
    const trailAssocs = await prismaClient.trailActChatbot.findMany({
      where: { actChatbotId },
      select: { trailId: true },
    });

    await Promise.all(
      trailAssocs.map(async ({ trailId }) => {
        const remaining = await prismaClient.trailActChatbot.findMany({
          where: { trailId, actChatbotId: { not: actChatbotId } },
          orderBy: { index: "asc" },
          select: { actChatbotId: true },
        });
        const ordered = remaining.map((r, i) => ({ actChatbotId: r.actChatbotId, index: i }));
        return this.syncTrailActs(trailId, ordered);
      }),
    );
  }

  async setActs({ trailId, acts }: SetTrailActsRequest) {
    const ordered = [...acts]
      .sort((a, b) => a.index - b.index)
      .map((a, i) => ({ actChatbotId: a.actChatbotId, index: i }));

    return this.syncTrailActs(trailId, ordered);
  }
}

export { TrailAdminService };
