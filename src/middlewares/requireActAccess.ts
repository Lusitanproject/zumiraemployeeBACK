import { NextFunction, Request, Response } from "express";

import { Permission } from "../permissions";
import prismaClient from "../prisma";
import { hasPermission } from "../utils/permissions";

type ActAccessScope = {
  idParam?: string;
  company: Permission;
  owned: Permission;
  platform?: Permission; // quando ausente, atos Zumira (companyId null) ficam sempre bloqueados
};

export function requireActAccess({ idParam = "id", company, owned, platform }: ActAccessScope) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requireActAccess' should always be called after 'isAuthenticated'");

    const user = req.user;
    if (user.role === "admin") return next();

    const act = await prismaClient.actChatbot.findUnique({
      where: { id: req.params[idParam] },
      select: { companyId: true, ownerId: true },
    });

    const allowed =
      !!act &&
      (act.companyId === null
        ? !!platform && hasPermission(user, platform)
        : (hasPermission(user, company) && act.companyId === user.companyId) ||
          (hasPermission(user, owned) && act.ownerId === user.id));

    if (!allowed) return res.status(403).json({ status: "ERROR", message: "Forbidden" });

    next();
  };
}
