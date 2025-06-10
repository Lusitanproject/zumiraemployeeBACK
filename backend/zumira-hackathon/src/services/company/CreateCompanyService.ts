import prismaClient from "../../prisma";

interface CompanyRequest {
  email: string;
  name: string;
}

class CreateCompanyService {
  async execute({ name, email }: CompanyRequest) {
    const company = await prismaClient.company.create({
      data: {
        name,
        email,
      },
    });

    return company;
  }
}

export { CreateCompanyService };
