import prismaClient from "../../prisma";

class NationalityService {
  async list() {
    const nationalities = await prismaClient.nationality.findMany({
      select: { id: true, acronym: true, name: true },
    });
    return { items: nationalities };
  }
}

export { NationalityService };
