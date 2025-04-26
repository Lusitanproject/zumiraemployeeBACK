import prismaClient from "../../prisma";

interface UserRequest {
  name: string;
  email: string;
  role: "user" | "company" | "admin";
  companyId?: string;
}

class CreateUserService {
  async execute({ name, email, role, companyId }: UserRequest) {
    const userExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExists) throw new Error("User already exists");

    const companyExists = await prismaClient.company.findFirst({
      where: {
        id: companyId,
      },
    });
    if (!companyExists) throw new Error("Company does not exist");

    const roleExists = await prismaClient.role.findFirst({
      where: {
        slug: role,
      },
    });
    if (!roleExists) throw new Error(`Role does not exist`);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        roleId: roleExists.id,
        companyId,
      },
    });

    return user;
  }
}

export { CreateUserService };
