import { CreateUserRequest } from "../../definitions/user";
import prismaClient from "../../prisma";

class CreateUserService {
  async execute(data: CreateUserRequest) {
    const userExists = await prismaClient.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (userExists) throw new Error("User already exists");

    const role = await prismaClient.role.findFirst({
      where: {
        slug: "user",
      },
    });
    if (!role) throw new Error("Internal error");

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
