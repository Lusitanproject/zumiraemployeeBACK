import { CreateUserRequest } from "../../definitions/user";
import { PublicError } from "../../error";
import prismaClient from "../../prisma";

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

    const firstAct = await prismaClient.actChatbot.findFirst({
      orderBy: {
        index: "asc",
      },
    });

    const user = await prismaClient.user.create({
      data: {
        ...data,
        roleId: role.id,
        currentActChatbotId: firstAct?.id,
      },
    });

    return user;
  }
}

export { CreateUserService };
