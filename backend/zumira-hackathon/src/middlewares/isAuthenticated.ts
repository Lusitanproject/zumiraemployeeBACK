import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prismaClient from "../prisma";

interface Payload {
  sub: string;
}

async function getUserData(userId: string): Promise<Request["user"]> {
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error("User does not exist");

  return {
    id: user.id,
    role: user.role.slug,
    permissions: user.role.rolePermissions.map((p) => p.permission.slug),
  };
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ");

  try {
    // Validar o token
    const { sub } = verify(token, process.env.JWT_SECRET!) as Payload;

    // Recuperar o id do token e armazenar numa variavel user dentro de req
    const userId = sub;

    req.user = await getUserData(userId);

    return next();
  } catch {
    return res.status(401).end();
  }
}
