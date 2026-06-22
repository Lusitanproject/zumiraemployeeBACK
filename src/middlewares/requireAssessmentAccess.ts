import { NextFunction, Request, Response } from "express";

import { Permission } from "../permissions";
import prismaClient from "../prisma";
import { hasPermission } from "../utils/permissions";

type AssessmentAccessScope = {
  idParam?: string;
  company: Permission;
  owned: Permission;
  platform?: Permission; // quando ausente, avaliações Zumira (companyId null) ficam sempre bloqueadas
};

export function requireAssessmentAccess({ idParam = "id", company, owned, platform }: AssessmentAccessScope) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requireAssessmentAccess' should always be called after 'isAuthenticated'");

    const user = req.user;
    if (user.role === "admin") return next();

    const assessment = await prismaClient.assessment.findUnique({
      where: { id: req.params[idParam] },
      select: { companyId: true, ownerId: true },
    });

    const allowed =
      !!assessment &&
      (assessment.companyId === null
        ? !!platform && hasPermission(user, platform)
        : (hasPermission(user, company) && assessment.companyId === user.companyId) ||
          (hasPermission(user, owned) && assessment.ownerId === user.id));

    if (!allowed) return res.status(403).json({ status: "ERROR", message: "Forbidden" });

    next();
  };
}
