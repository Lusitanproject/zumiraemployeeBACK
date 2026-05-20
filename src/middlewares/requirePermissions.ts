import { NextFunction, Request, Response } from "express";

export function requirePermissions(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("'requirePermissions' should always be called after 'isAuthenticated'");

    if (req.user.role === "admin") return next();

    if (!req.user.permissions.includes(permission)) {
      console.log(`Usuário ${req.user.name} não tem permissão: ${permission}`);
      return res.status(403).json({ status: "ERROR", message: "Forbidden" });
    }

    next();
  };
}
