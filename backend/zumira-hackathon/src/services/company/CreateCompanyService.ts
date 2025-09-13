import prismaClient from "../../prisma";

interface CompanyRequest {
  email: string;
  name: string;
  trailId: string;
}

class CreateCompanyService {
  async execute({ name, email, trailId }: CompanyRequest) {
    const company = await prismaClient.company.create({
      data: {
        name,
        email,
        trailId,
      },
    });

    return company;
  }
}

export { CreateCompanyService };
