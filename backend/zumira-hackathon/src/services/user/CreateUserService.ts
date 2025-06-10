import { CreateUserRequest } from "../../definitions/user";
import prismaClient from "../../prisma";
import { PublicError } from "../../error";

class CreateUserService {
  async execute(data: CreateUserRequest) {
    const userExists = await prismaClient.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (userExists) throw new PublicError("Usuário já existe");

    const role = await prismaClient.role.findFirst({
      where: {
        slug: "user",
      },
    });
    if (!role) throw new Error("Cargo usuario não encontrado");

    const user = await prismaClient.user.create({
      data: {
        ...data,
        roleId: role.id,
      },
    });

    return user;
  }
}

export { CreateUserService };
