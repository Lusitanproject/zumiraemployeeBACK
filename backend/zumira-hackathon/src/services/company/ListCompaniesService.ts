import prismaClient from "../../prisma";

class ListCompaniesService {
  async execute() {
    const companies = await prismaClient.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { users: true },
        },
      },
    });

    const formattedCompanies = companies.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      numberOfUsers: c._count.users,
    }));

    return { companies: formattedCompanies };
  }
}

export { ListCompaniesService };
