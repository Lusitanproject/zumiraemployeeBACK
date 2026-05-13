import prismaClient from "../../prisma";

class ListNationalitiesService {
  async execute() {
    const nationalities = await prismaClient.nationality.findMany({
      select: {
        id: true,
        acronym: true,
        name: true,
      },
    });
    return { items: nationalities };
  }
}

export { ListNationalitiesService };
