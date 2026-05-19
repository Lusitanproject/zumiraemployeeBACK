import { NextFunction, Request, Response } from "express";

export function requirePermissions(permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requirePermissions' should always be called after 'isAuthenticated'");

    const missingPermissions = permissions.filter((p) => !req.user.permissions.includes(p));

    if (missingPermissions.length > 0) {
      console.log(`Usuário ${req.user.name} não tem permissões: ${missingPermissions.join(", ")}`);
      return res.status(403).json({ status: "ERROR", message: "Forbidden" });
    }

    next();
  };
}
